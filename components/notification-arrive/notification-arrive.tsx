/**
 * NotificationArrive — iOS-style drop-from-top with spring settle.
 *
 * Wraps a notification banner (af-ios-notification, liquid-glass-frame, etc.)
 * to give it the canonical iOS "ding!" arrival motion: drops down + scales
 * slightly up + settles. Used for kundenstimmen pages showing real notifications
 * from leads / customers as they arrive.
 *
 * Distinct from SwipeIn because it uses a spring-style easing (slight overshoot)
 * vs SwipeIn's clean ease-out. The overshoot is what makes it FEEL like a real
 * notification rather than just sliding content.
 *
 * Direction (engraved 2026-05-17 per device-authenticity lab):
 *   - 'top' (default) — iOS drop-from-top with spring settle. Pairs with
 *     af-ios-notification + iphone-chassis.
 *   - 'right' — macOS Notification Center slide-from-right. Pairs with
 *     macos-notification-banner + macbook-pro-chassis (per af-surfaces lab
 *     report 2026-05-17 § Tier-1 #2). The unified animation primitive avoids
 *     forking the spring math across platforms.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/notification-arrive.json
 *
 * Usage:
 *   <NotificationArrive>
 *     <AfIosNotification appName="WhatsApp" title="Damian" body="Wann der Call?" />
 *   </NotificationArrive>
 *
 *   <NotificationArrive direction="right" delayMs={2000} replayKey={msgCount}>
 *     <MacosNotificationBanner appName="WhatsApp" title="Damian" body="Wann der Call?" />
 *   </NotificationArrive>
 */

'use client';

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';
import { useReducedMotion } from './use-reduced-motion';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface NotificationArriveProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Drop/slide distance in px (how far from the resting position it starts). Default 56. */
  distance?: number;
  /** Animation duration in ms. Default 620 (includes spring settle). */
  durationMs?: number;
  /** Delay before arriving in ms. Default 0. */
  delayMs?: number;
  /**
   * Spring easing — the iOS-y overshoot. Default 'cubic-bezier(0.34, 1.56, 0.64, 1)'
   * (easeOutBack with mild overshoot). For a stiffer settle: 'cubic-bezier(0.5, 1.4, 0.6, 1)'.
   * For no overshoot at all, use SwipeIn instead — that's the right primitive.
   */
  easing?: string;
  /**
   * When this value changes, the animation replays. Useful for showing a NEW
   * notification arrive (e.g., bump a counter or use a timestamp).
   */
  replayKey?: string | number;
  /** When false, the element stays in resting position. Default true. */
  enabled?: boolean;
  /**
   * Direction the notification arrives FROM. Default 'top' (iOS drop-from-top
   * with spring settle). Use 'right' for macOS Notification Center slide-from-right
   * behavior. Required by the macos-notification-banner registry entry per
   * af-surfaces/2026-05-17-device-authenticity-audit § Tier-1 #1+2.
   */
  direction?: 'top' | 'right';
}

export function NotificationArrive({
  children,
  distance = 56,
  durationMs = 620,
  delayMs = 0,
  easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  replayKey,
  enabled = true,
  direction = 'top',
  className,
  style,
  ...rest
}: NotificationArriveProps) {
  const reducedMotion = useReducedMotion();
  const [arrived, setArrived] = useState(false);
  const mountedRef = useRef(false);

  // Reset and replay when replayKey changes
  useEffect(() => {
    if (!enabled) return;
    setArrived(false);
    const raf = requestAnimationFrame(() => {
      setArrived(true);
      mountedRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [replayKey, enabled]);

  // The spring overshoot is exactly what reduced-motion users want suppressed.
  // Gate the entire animation: notification appears at rest, full scale, no
  // drop, no spring. WCAG 2.2 SC 2.3.3 + Val Head "Designing Safer Animations"
  // (Smashing 2025). AF Werkschau lab report 2026-05-16 § A.5.
  const motionOff = reducedMotion || !enabled;

  // Per direction: 'top' = drop from above (y axis), 'right' = slide from right
  // edge (x axis). Same spring math, same overshoot, same scale-squeeze (0.94)
  // — just the axis flips. The transformOrigin tracks the FROM edge so the
  // scale appears to grow from the entry point, not from the center.
  const offset = direction === 'right'
    ? { x: distance, y: 0 }
    : { x: 0, y: -distance };

  const transform = motionOff || arrived
    ? 'translate3d(0,0,0) scale(1)'
    : `translate3d(${offset.x}px, ${offset.y}px, 0) scale(0.94)`;

  return (
    <div
      className={cn('inline-block', className)}
      style={{
        transform,
        opacity: motionOff || arrived ? 1 : 0,
        transition: motionOff
          ? 'none'
          : `transform ${durationMs}ms ${easing} ${delayMs}ms, opacity ${Math.min(durationMs, 320)}ms ease-out ${delayMs}ms`,
        // Dynamic will-change — see swipe-in.tsx for full rationale.
        // Reduced-motion users skip the promotion entirely.
        // AF Werkschau lab report 2026-05-16 § A.6.
        willChange: motionOff || arrived ? 'auto' : 'transform, opacity',
        transformOrigin: direction === 'right' ? 'right center' : 'top center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
