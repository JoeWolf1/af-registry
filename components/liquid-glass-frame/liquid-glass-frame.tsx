/**
 * Liquid-Glass Frame — AF decorative chassis (translucent frosted-glass material).
 *
 * Multi-layer translucent chassis effect that wraps content (an iPhone mock,
 * a video player, a testimonial-card decorative frame) in a frosted-glass
 * material. The visitor reads it as premium / crafted / Apple-canon-adjacent
 * without being a direct Apple ripoff.
 *
 * Status: [damian-canon-needed] on exact blur/transmission stops.
 * Working default is AFCO-inferred from shipped surfaces; queued for Damian-mode
 * validation at ~/.claude/skills/af-design-catalog/PENDING-DAMIAN-VALIDATION.md.
 *
 * Source of truth: ~/.claude/skills/af-design-catalog/palettes/liquid-glass.md
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/liquid-glass-frame.json
 *
 * Usage:
 *   <LiquidGlassFrame>
 *     <IPhoneChassis>
 *       <WhatsAppChat ... />
 *     </IPhoneChassis>
 *   </LiquidGlassFrame>
 *
 * IMPORTANT — only applies on AF Experience-Page + Freigabe-Portal anchors.
 * Off-canon for Marketing-Landing + Internal-Tool surfaces.
 *
 * Performance — backdrop-filter is GPU-heavy. Constraints:
 *   - Max ~3 simultaneous Liquid-Glass elements per viewport
 *   - Avoid backdrop-filter on elements that change every frame
 *   - Test on mid-range mobile before shipping
 *
 * Accessibility — respects prefers-reduced-transparency: reduce by falling
 * back to opaque --af-paper.
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface LiquidGlassFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Content wrapped by the Liquid-Glass chassis. */
  children: ReactNode;
  /**
   * Intensity variant:
   * - `default` — canonical 4-layer stack
   * - `subtle` — lighter transmission + reduced underglow (for over-busy backgrounds)
   * - `pulse-tinted` — AFVQ-blue infused transmission (when paired with AFVQ-card context)
   */
  intensity?: 'default' | 'subtle' | 'pulse-tinted';
  /**
   * Border radius variant. Defaults to 28px (matches Liquid-Glass canonical).
   * Override when wrapping content with a specific radius requirement.
   */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LiquidGlassFrame({
  children,
  intensity = 'default',
  radius = 'lg',
  className,
  ...rest
}: LiquidGlassFrameProps) {
  const radiusClass = {
    sm: 'rounded-2xl',
    md: 'rounded-3xl',
    lg: 'rounded-[28px]',
    xl: 'rounded-[36px]',
  }[radius];

  // The 4 layers — transmission, frosting, edge highlights, underglow
  // Per palettes/liquid-glass.md § "Inferred spec — DO NOT TREAT AS CANON"
  const intensityClasses = {
    default: cn(
      'bg-white/[0.04]',
      'backdrop-blur-[20px] backdrop-saturate-[180%]',
      'border border-white/10',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(1,14,38,0.04),0_16px_48px_-8px_var(--af-pulse-glow-12,rgba(96,165,250,0.12)),0_8px_24px_-4px_var(--af-ink-glow-08,rgba(1,14,38,0.08))]',
    ),
    subtle: cn(
      'bg-white/[0.02]',
      'backdrop-blur-[12px] backdrop-saturate-[140%]',
      'border border-white/[0.06]',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_24px_-4px_var(--af-ink-glow-08,rgba(1,14,38,0.08))]',
    ),
    'pulse-tinted': cn(
      'bg-[var(--af-pulse-glow-06,rgba(96,165,250,0.06))]',
      'backdrop-blur-[20px] backdrop-saturate-[180%]',
      'border border-[var(--af-pulse-glow-12,rgba(96,165,250,0.12))]',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_48px_-8px_var(--af-pulse-glow-20,rgba(96,165,250,0.20)),0_8px_24px_-4px_var(--af-ink-glow-08,rgba(1,14,38,0.08))]',
    ),
  }[intensity];

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        radiusClass,
        intensityClasses,
        // prefers-reduced-transparency fallback — opaque paper, no backdrop
        // (Tailwind doesn't ship a motion-reduce: equivalent for transparency;
        // the manual @media block lives in af-tokens.css companion stylesheet)
        '[@media(prefers-reduced-transparency:reduce)]:bg-[color:var(--af-paper,#FFFFFF)]',
        '[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
