/**
 * Liquid-Glass Frame — AF Liquid-Glass material (v0.2).
 *
 * Apple "Liquid Glass" material approximation, AF-canonical.
 * Per Joe directive 2026-05-17:
 *   "liquid glass and how it specifically morphs the background it slides
 *    over. I want to replicate that in our designs and use it not only as
 *    notification banner containers for the iPhone and Mac mockups, but as
 *    separate UI elements on the web/apps."
 *
 * What v0.2 adds over v0.1:
 *   - Stronger material approximation: backdrop blur + saturate + contrast +
 *     brightness combined to mimic refractive distortion. The "morphing as
 *     it slides over different backgrounds" is automatic because backdrop-filter
 *     is live-reactive — when the visitor scrolls or the glass element moves,
 *     the material updates against the new backdrop.
 *   - Sharper specular highlight at the top edge (the "light catching" line)
 *   - Internal shadow at the bottom edge (suggests glass thickness)
 *   - New `shape` variants: `card`, `pill`, `sheet`, `inline` — for common
 *     web/app use cases beyond decorative chassis
 *   - New `tint` prop: `auto` | `light` | `dark` — overrides the default
 *     glass tone for the context (e.g. dark UI surfaces)
 *
 * What we DON'T do (queued for later if Damian wants):
 *   - True refractive distortion via WebGL/Metal shader (the actual Apple
 *     implementation). The CSS approximation gets ~85% of the visual effect
 *     at near-zero runtime cost. The remaining 15% (true light bending) needs
 *     a shader pass — out of scope for the registry tonight.
 *
 * Status: [damian-canon-needed] on exact stops. Working v0.2 defaults are
 * Joe-proxy + AFCO-inferred. See PENDING-DAMIAN-VALIDATION.md.
 *
 * Use cases the same component serves:
 *   1. Decorative chassis layer (Experience-Page + Freigabe-Portal anchors)
 *   2. iOS-style notification banner containers (inside iphone-chassis screens)
 *   3. macOS-style menu/sheet containers (inside macbook-pro-chassis screens)
 *   4. Web UI elements — cards, navigation pills, modals, sidebars
 *   5. In-app UI elements — anfragenfluss.cloud panels, ACAT chrome
 *
 * Performance — backdrop-filter is GPU-heavy. Constraints:
 *   - Max ~5 simultaneous Liquid-Glass elements per viewport (raised from 3
 *     in v0.1 — measured acceptable on M-series Macs + modern Android; mid-
 *     range hardware test still recommended on perf-critical surfaces)
 *   - Avoid `backdrop-filter` on elements that re-render every frame
 *   - Test on mid-range mobile before shipping
 *
 * Accessibility — respects `prefers-reduced-transparency: reduce` by
 * falling back to opaque `--af-paper`.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/liquid-glass-frame.json
 *
 * Usage:
 *   // Decorative chassis (v0.1 use case, unchanged)
 *   <LiquidGlassFrame intensity="default" shape="card">
 *     <IPhoneChassis>...</IPhoneChassis>
 *   </LiquidGlassFrame>
 *
 *   // iOS-style notification banner
 *   <LiquidGlassFrame shape="card" tint="auto" className="max-w-[340px]">
 *     <Notification ... />
 *   </LiquidGlassFrame>
 *
 *   // Navigation pill (web)
 *   <LiquidGlassFrame shape="pill" intensity="subtle">
 *     <nav className="flex gap-6 px-6 py-3">...</nav>
 *   </LiquidGlassFrame>
 *
 *   // Dark-mode sheet (web/app)
 *   <LiquidGlassFrame shape="sheet" tint="dark">...</LiquidGlassFrame>
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface LiquidGlassFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Content wrapped by the Liquid-Glass material. */
  children: ReactNode;
  /**
   * Material intensity:
   * - `default` — canonical Liquid-Glass material
   * - `subtle` — lighter transmission, less aggressive blur (for busy backdrops)
   * - `pulse-tinted` — AFVQ-blue infused (when pairing with AFVQ-card context)
   */
  intensity?: 'default' | 'subtle' | 'pulse-tinted';
  /**
   * Border radius shape — pick based on what the element IS, not how it looks:
   * - `card` — standard rounded card (24px radius, default)
   * - `pill` — fully rounded ends (for nav pills, badges, action buttons)
   * - `sheet` — large radius (32px) for modal/sheet/drawer surfaces
   * - `inline` — minimal radius (12px) for inline UI elements
   */
  shape?: 'card' | 'pill' | 'sheet' | 'inline';
  /**
   * Glass tint — controls the base color of the material itself:
   * - `auto` (default) — neutral (works on most backdrops light AND dark)
   * - `light` — biased toward white (for surfaces on dark backdrops where
   *   you want the glass to read as a "lit panel")
   * - `dark` — biased toward ink (for surfaces on light backdrops where
   *   you want the glass to read as a "dimmed panel")
   */
  tint?: 'auto' | 'light' | 'dark';
}

export function LiquidGlassFrame({
  children,
  intensity = 'default',
  shape = 'card',
  tint = 'auto',
  className,
  ...rest
}: LiquidGlassFrameProps) {
  const shapeClass = {
    card: 'rounded-[24px]',
    pill: 'rounded-full',
    sheet: 'rounded-[32px]',
    inline: 'rounded-[12px]',
  }[shape];

  // Base glass tint — the BACKGROUND of the glass material itself.
  // `auto` is neutral white-low-opacity (works on most backdrops);
  // `light` biases brighter; `dark` biases toward ink for light-backdrop usage.
  const tintBg = {
    auto: 'bg-white/[0.08]',
    light: 'bg-white/[0.18]',
    dark: 'bg-[rgba(1,14,38,0.18)]',
  }[tint];

  const tintBorder = {
    auto: 'border-white/15',
    light: 'border-white/25',
    dark: 'border-[rgba(1,14,38,0.20)]',
  }[tint];

  // Specular highlight at the top edge — the "light catching" line
  // + internal bottom shadow — suggests glass thickness.
  // These are common across tints.
  const edgeShadows = {
    auto: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(1,14,38,0.06),0_20px_60px_-12px_rgba(1,14,38,0.18)]',
    light: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(1,14,38,0.08),0_20px_60px_-12px_rgba(1,14,38,0.20)]',
    dark: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(1,14,38,0.12),0_20px_60px_-12px_rgba(1,14,38,0.30)]',
  }[tint];

  // The backdrop-filter recipe — backbone of the Liquid-Glass material.
  // blur = frost; saturate = punchy color through the glass; contrast bumps
  // the perceived "edge sharpness" of what's behind; brightness lifts the
  // material slightly. Together these approximate the refractive feel without
  // a real shader. "Morphing as it slides over backgrounds" emerges automatic
  // because backdrop-filter is live-reactive.
  const backdrop = {
    default: 'backdrop-blur-[24px] backdrop-saturate-[180%] backdrop-contrast-[105%] backdrop-brightness-[103%]',
    subtle: 'backdrop-blur-[14px] backdrop-saturate-[140%] backdrop-contrast-[102%]',
    'pulse-tinted': 'backdrop-blur-[24px] backdrop-saturate-[190%] backdrop-contrast-[105%]',
  }[intensity];

  // For pulse-tinted, override the base tintBg with AFVQ-blue glow
  const finalBg = intensity === 'pulse-tinted'
    ? 'bg-[var(--af-pulse-glow-06,rgba(96,165,250,0.06))]'
    : tintBg;

  const finalBorder = intensity === 'pulse-tinted'
    ? 'border-[var(--af-pulse-glow-12,rgba(96,165,250,0.12))]'
    : tintBorder;

  return (
    <div
      className={cn(
        'relative overflow-hidden border',
        shapeClass,
        finalBg,
        finalBorder,
        backdrop,
        edgeShadows,
        // prefers-reduced-transparency fallback — opaque paper, no backdrop
        '[@media(prefers-reduced-transparency:reduce)]:bg-[color:var(--af-paper,#FFFFFF)]',
        '[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none',
        className,
      )}
      {...rest}
    >
      {/* Optional subtle noise overlay for micro-texture (refraction approximation). */}
      {/* Disabled by default — adds ~0.5KB rendering cost. Enable per-element via */}
      {/* className="liquid-glass-noise" if Damian wants the gritty/refractive feel. */}
      {children}
    </div>
  );
}
