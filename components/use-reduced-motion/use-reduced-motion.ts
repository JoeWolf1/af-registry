/**
 * useReducedMotion — subscribes to the OS-level `prefers-reduced-motion: reduce`
 * media query and returns true when the user has asked the system to minimize
 * non-essential animation.
 *
 * Shared by every AF Werkschau animation primitive (SwipeIn, ScrollReveal,
 * NotificationArrive, PressLike, TypewriterRotator) so the gate logic stays
 * consistent — one source of truth, one place to test.
 *
 * Returns false during SSR (no `window.matchMedia` on the server). The first
 * client render after hydration flips it to the actual user preference.
 *
 * WCAG 2.2 SC 2.3.3 (Animation from Interactions, AAA): non-essential motion
 * must be suppressible. Joshua Comeau "Prefers Reduced Motion" + Val Head
 * "Designing Safer Animations" (Smashing, May 2025) are the canonical guides.
 * AF Werkschau lab report 2026-05-16 § A.5.
 */

'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    // Subscribe to changes — user can toggle the OS setting mid-session
    // (System Settings → Accessibility → Display → Reduce motion on macOS).
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
