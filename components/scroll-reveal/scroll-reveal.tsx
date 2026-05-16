/**
 * ScrollReveal — wraps any element to fade + slide in when scrolled into view.
 *
 * IntersectionObserver-based — fires once when the element crosses the
 * threshold. Modular animation primitive sibling to SwipeIn and
 * NotificationArrive. The workhorse for long-form pages (kundenstimmen,
 * Fallstudien) where sections should animate in as the reader scrolls.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/scroll-reveal.json
 *
 * Usage:
 *   <ScrollReveal>
 *     <SectionCard title="Outcomes" />
 *   </ScrollReveal>
 *
 *   <ScrollReveal from="up" distance={32} threshold={0.4}>
 *     <BigStatNumber>+187%</BigStatNumber>
 *   </ScrollReveal>
 */

'use client';

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';
import { useReducedMotion } from './use-reduced-motion';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface ScrollRevealProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Direction the element comes FROM as it reveals. Default 'down' (rises into place). */
  from?: 'left' | 'right' | 'up' | 'down';
  /** Travel distance in px. Default 32. */
  distance?: number;
  /** Animation duration in ms. Default 720. */
  durationMs?: number;
  /** Delay after entering view, in ms. Default 0. */
  delayMs?: number;
  /** IntersectionObserver threshold (0–1). Default 0.15 — fires when ~15% in view. */
  threshold?: number;
  /**
   * IntersectionObserver rootMargin. Default '0px 0px -80px 0px' — fires
   * slightly BEFORE the element fully crosses the viewport bottom, so the
   * animation has begun by the time it's prominently in view.
   */
  rootMargin?: string;
  /** CSS easing. Default 'cubic-bezier(0.22, 1, 0.36, 1)'. */
  easing?: string;
  /** When true, fires on every entry/exit instead of just once. Default false. */
  replayOnReEnter?: boolean;
  /** When false, the element stays at its origin position. Default true. */
  enabled?: boolean;
}

export function ScrollReveal({
  children,
  from = 'down',
  distance = 32,
  durationMs = 720,
  delayMs = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -80px 0px',
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  replayOnReEnter = false,
  enabled = true,
  className,
  style,
  ...rest
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // Reduced-motion users skip the observer — element is shown immediately
    // at its resting position, no scroll-triggered animation.
    // WCAG 2.2 SC 2.3.3. AF Werkschau lab report 2026-05-16 § A.5.
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    // Server / no-IO fallback — reveal immediately
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (!replayOnReEnter) observer.disconnect();
          } else if (replayOnReEnter) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, threshold, rootMargin, replayOnReEnter, reducedMotion]);

  const motionOff = reducedMotion || !enabled;

  // Translate offset for the FROM position
  const offset =
    from === 'left' ? { x: -distance, y: 0 } :
    from === 'right' ? { x: distance, y: 0 } :
    from === 'up' ? { x: 0, y: -distance } :
    { x: 0, y: distance };

  const transform = motionOff || revealed
    ? 'translate3d(0,0,0)'
    : `translate3d(${offset.x}px, ${offset.y}px, 0)`;

  return (
    <div
      ref={ref}
      className={cn('block', className)}
      style={{
        transform,
        opacity: motionOff || revealed ? 1 : 0,
        transition: motionOff
          ? 'none'
          : `transform ${durationMs}ms ${easing} ${delayMs}ms, opacity ${durationMs}ms ${easing} ${delayMs}ms`,
        // Dynamic will-change — see swipe-in.tsx for full rationale.
        // On a kundenstimmen page with 10–15 ScrollReveals the permanent
        // version held 40–90 MB GPU memory indefinitely. Drop it once
        // `revealed` flips true and the entrance animation completes.
        // Reduced-motion users skip layer promotion entirely (no animation).
        // AF Werkschau lab report 2026-05-16 § A.6.
        willChange: motionOff || revealed ? 'auto' : 'transform, opacity',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
