/**
 * SwipeIn — wraps any element to swipe in from a direction.
 *
 * Modular animation primitive. Drop around any child to give it an entrance
 * motion. Plays once on mount by default; can be configured to replay on a key
 * change. Pairs with scroll-reveal (scroll-triggered) and notification-arrive
 * (drop-from-top spring).
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/swipe-in.json
 *
 * Usage:
 *   <SwipeIn from="left">
 *     <WhatsAppMessageBubble>Hi Damian!</WhatsAppMessageBubble>
 *   </SwipeIn>
 */

'use client';

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';
import { useReducedMotion } from './use-reduced-motion';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface SwipeInProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Direction the element swipes IN FROM. Default 'left'. */
  from?: 'left' | 'right' | 'up' | 'down';
  /** Travel distance in px. Default 64. */
  distance?: number;
  /** Animation duration in ms. Default 480. */
  durationMs?: number;
  /** Delay before starting in ms. Default 0. */
  delayMs?: number;
  /** CSS easing function. Default 'cubic-bezier(0.22, 1, 0.36, 1)' (overshoot-free easeOutExpo-ish). */
  easing?: string;
  /**
   * When this value changes, the animation replays. Useful for re-triggering
   * on tab switch / story re-mount / Joe clicks "play again".
   */
  replayKey?: string | number;
  /** When false, the element stays in its origin position permanently. Default true. */
  enabled?: boolean;
}

export function SwipeIn({
  children,
  from = 'left',
  distance = 64,
  durationMs = 480,
  delayMs = 0,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  replayKey,
  enabled = true,
  className,
  style,
  ...rest
}: SwipeInProps) {
  const reducedMotion = useReducedMotion();
  const [played, setPlayed] = useState(false);
  const mountedRef = useRef(false);

  // Reset and replay when replayKey changes
  useEffect(() => {
    if (!enabled) return;
    setPlayed(false);
    // Next frame: flip to played → triggers the transition
    const raf = requestAnimationFrame(() => {
      setPlayed(true);
      mountedRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [replayKey, enabled]);

  // Reduced-motion users get the resting state immediately with no transition.
  // WCAG 2.2 SC 2.3.3 — non-essential motion is suppressible. Joshua Comeau
  // "Prefers Reduced Motion" + Val Head "Designing Safer Animations" (Smashing
  // 2025). AF Werkschau lab report 2026-05-16 § A.5.
  const motionOff = reducedMotion || !enabled;

  // Translate offset for the FROM position
  const offset =
    from === 'left' ? { x: -distance, y: 0 } :
    from === 'right' ? { x: distance, y: 0 } :
    from === 'up' ? { x: 0, y: -distance } :
    { x: 0, y: distance };

  const transform = motionOff || played
    ? 'translate3d(0,0,0)'
    : `translate3d(${offset.x}px, ${offset.y}px, 0)`;

  return (
    <div
      className={cn('inline-block', className)}
      style={{
        transform,
        opacity: motionOff || played ? 1 : 0,
        transition: motionOff
          ? 'none'
          : `transform ${durationMs}ms ${easing} ${delayMs}ms, opacity ${durationMs}ms ${easing} ${delayMs}ms`,
        // Dynamic will-change: promote the GPU compositor layer ONLY while the
        // animation is en route. After `played` flips true the transition
        // continues to the resting position; once settled, we drop will-change
        // so the browser can release the layer (4–6 MB GPU memory per layer per
        // Paul Lewis, web.dev "Stick to Compositor-Only Properties" 2025).
        // Fixes the "all 17 ScrollReveals hold layers forever on a long page"
        // class of memory bloat. AF Werkschau lab report 2026-05-16 § A.6.
        // Reduced-motion users skip the promotion entirely — no animation, no
        // layer needed.
        willChange: motionOff || played ? 'auto' : 'transform, opacity',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
