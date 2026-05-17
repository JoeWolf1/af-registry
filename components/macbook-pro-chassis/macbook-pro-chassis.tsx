/**
 * MacBook Pro Chassis — reusable desktop device-frame for AF surfaces.
 *
 * The canonical device-mock for displaying desktop-medium content
 * (anfragenfluss.cloud dashboard, fulfillment-app, web apps, browser views).
 * Sibling to iphone-chassis — same API shape, same wallpaper fallback, same
 * size/variant/immersive system. Use this where the AF surface is a desktop
 * tool/app being demonstrated; use iphone-chassis where it's a phone-medium
 * artifact (WhatsApp, Reels, voice messages).
 *
 * Responsive pattern Joe directed 2026-05-17:
 *   "Use Macs for desktop versions where useful, stick to iPhone on mobile."
 *
 *   <div className="lg:hidden">
 *     <IPhoneChassis>...</IPhoneChassis>
 *   </div>
 *   <div className="hidden lg:block">
 *     <MacbookProChassis>...</MacbookProChassis>
 *   </div>
 *
 * Source of truth: af-brand-doctrine + iphone-chassis sibling component.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/macbook-pro-chassis.json
 *
 * Usage:
 *   <MacbookProChassis caption="anfragenfluss.cloud dashboard">
 *     <DashboardScreenshot />
 *   </MacbookProChassis>
 *
 * IMPORTANT — preflight-device-mock skill MUST fire before real-surface use
 * (brand-wide rule; same as iphone-chassis).
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface MacbookProChassisProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Screen content. Optional; AF wallpaper renders as fallback. */
  children?: ReactNode;
  /** Optional caption below the device. */
  caption?: ReactNode;
  /**
   * Visual variant for the device frame:
   * - `space-black` — Apple Space Black (#1D1D1F). Correct choice for dark hero
   *   backgrounds. Source: ~/Anfragenfluss-style/audits/macbook-pro-m4-mockup.md §13.
   * - `space-gray` (default) — Apple Space Gray (#3A3A3C), neutral dark aluminum.
   * - `silver` — Apple Silver (#D7D9DD), light frame for paper/light backgrounds.
   */
  variant?: 'space-black' | 'space-gray' | 'silver';
  /**
   * Device size — controls overall scale.
   * - `compact` — for inline use (~480px wide, fixed)
   * - `default` — standard (~640px wide on md+, fixed)
   * - `hero` — large hero use (~880px wide on md+, fixed)
   * - `fluid` — viewport-aware. Width set to `min(80vw, 1000px)`; height
   *   auto-derives via aspect-ratio. Never overflows.
   */
  size?: 'compact' | 'default' | 'hero' | 'fluid';
  /** When true, hides the notch + status bar. Full-bleed screen content. */
  immersive?: boolean;
  /**
   * Screen wallpaper rendered BEHIND children:
   * - `'af'` (default) — AF-branded wallpaper. Same as iphone-chassis. Joe-proxy.
   * - `'none'` — no wallpaper.
   * - ReactNode — custom wallpaper.
   */
  wallpaper?: 'af' | 'none' | ReactNode;
}

export function MacbookProChassis({
  children,
  caption,
  variant = 'space-gray',
  size = 'default',
  immersive = false,
  wallpaper = 'af',
  className,
  ...rest
}: MacbookProChassisProps) {
  // Fixed sizes set width; aspect ratio derives height for the screen lid.
  // `fluid` is width-constrained (Mac is wide; width matters more than height).
  const sizeClasses = {
    compact: 'w-[480px]',
    default: 'w-[560px] md:w-[640px]',
    hero: 'w-[720px] md:w-[880px]',
    fluid: 'w-[min(80vw,1000px)]',
  }[size];

  // Chassis tones — Apple-canon hex values per ~/Anfragenfluss-style/audits/macbook-pro-m4-mockup.md §4.
  // Calibration: medium (community-canonical photographic samples of apple.com hero renders;
  // Apple does not publish official hex values).
  // BUGFIX 2026-05-17: `space-gray` was previously mapped to --af-ink (#010E26), the AF brand's
  // navy text/ink token — NOT an aluminum color. Remapped to actual Apple Space Gray. Never bit
  // because no consumer used variant="space-gray" before (grep verified 2026-05-17). See lab
  // report: ~/lab-reports/2026/af-surfaces/2026-05-17-macbook-chassis-precision-elegance.md F2.
  const frameColor =
    variant === 'space-black'
      ? 'bg-[#1D1D1F] border-[#3A3A3D]'      // Apple Space Black — dark hero contexts
      : variant === 'space-gray'
        ? 'bg-[#3A3A3C] border-[#505053]'    // Apple Space Gray — neutral dark aluminum
        : 'bg-[#D7D9DD] border-[#B3B6BC]';   // Apple Silver — light/paper contexts

  // Base deck plane — slightly lighter than body, suggests keyboard deck behind lid.
  const baseColor =
    variant === 'space-black'
      ? 'bg-[#2D2D2F]'
      : variant === 'space-gray'
        ? 'bg-[#2C2C2E]'
        : 'bg-[#C0C3C8]';

  // Lid drop shadow — context-aware per ~/Anfragenfluss-style/audits/macbook-pro-m4-mockup.md §9.
  // Silver chassis sits on paper/light bgs → AFVQ ink-tinted shadow (brand glow on paper).
  // Space Black / Space Gray sit on dark bgs → neutral-black shadow at lower alpha; the
  // ink-tinted shadow vanishes against a near-ink-colored bg (audit §9: "Use only on light
  // backgrounds; on AFVQ dark sections, skip — faking [it] on a non-reflective dark
  // background reads as artifice.").
  const lidShadow =
    variant === 'silver'
      ? 'shadow-[0_30px_80px_-12px_var(--af-ink-glow-30,rgba(1,14,38,0.30)),0_12px_32px_-4px_var(--af-pulse-glow-12,rgba(96,165,250,0.12))]'
      : 'shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45),0_6px_20px_-4px_rgba(0,0,0,0.25)]';

  const wallpaperEl: ReactNode =
    wallpaper === 'none'
      ? null
      : wallpaper === 'af'
        ? <AfWallpaper />
        : wallpaper;

  return (
    <figure className={cn('flex flex-col items-center', className)} {...rest}>
      {/* Sized wrapper — lid + base share this width so `%` on the base resolves
          against the LID width, not the surrounding figure / card. Without this
          wrapper the base would stretch to whatever the figure's parent gives it. */}
      <div className={cn('relative flex flex-col items-center', sizeClasses)}>
      {/* ---- Lid (screen) ---- */}
      <div
        className={cn(
          // Lid outer frame — 16:10 aspect ratio (canonical MacBook Pro display)
          'relative aspect-[16/10] w-full rounded-[18px] border-[3px]',
          lidShadow,
          frameColor,
        )}
      >
        {/* Inner screen — bezel + content.
            CONCENTRIC CORNER MATH (gets the dark bezel right at corners):
              outer lid radius = 18px
              outer's border   = 3px (content-box edge at 3,3 from outer corner)
              inner inset      = 10px (from content-box edge)
              ⇒ inner bounding-box corner at (13, 13) from outer corner
              ⇒ for concentric curves, inner radius = 18 - 13 = 5px.
            Anything larger leaves white slivers at the corners (the inner div's
            bg-paper bleeds into where the lid curve has already retreated).
            Same bug class as iphone-chassis. Joe-flagged 2026-05-17. */}
        <div
          className={cn(
            'absolute inset-[10px] overflow-hidden rounded-[5px]',
            'bg-[color:var(--af-paper,#FFFFFF)]',
          )}
        >
          {/* Wallpaper layer — z-0, behind everything */}
          {wallpaperEl && (
            <div className="absolute inset-0 z-0" aria-hidden="true">
              {wallpaperEl}
            </div>
          )}

          {/* Notch — centered on top edge, omitted in immersive */}
          {!immersive && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute left-1/2 top-0 z-20 -translate-x-1/2',
                'h-[14px] w-[140px] rounded-b-[10px]',
                'bg-[color:var(--af-ink,#010E26)]',
              )}
            />
          )}

          {/* Top menu bar — minimal, for visual fidelity. Omitted in immersive. */}
          {!immersive && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute left-0 right-0 top-0 z-10',
                'flex items-center justify-between',
                'px-4 pt-[5px] text-[10px] font-semibold',
                wallpaper === 'af'
                  ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                  : 'text-[color:var(--af-ink,#010E26)]',
              )}
            >
              <span>● ● ●</span>
              <span className="opacity-80">9:41 AM</span>
            </div>
          )}

          {/* Screen content slot — fills the screen edge-to-edge (z-10).
              Children fill h-full w-full; menu bar overlays on top of whatever
              children render (like a real macOS app). Children that need to
              avoid the menu bar opt-in by adding pt-[24px] (or similar). */}
          <div className="relative z-10 h-full w-full">
            {children}
          </div>
        </div>
      </div>

      {/* ---- Base / hinge strip ----
          Directly attached to the lid bottom — no gap, no floating screen.
          Width: 102% of the LID (subtle overhang suggests keyboard deck plane
          behind the screen — anything more reads as wings). The `%` resolves
          against the sized wrapper above (which equals lid width), NOT the
          surrounding figure / card.
          Height: 10px (visible plane without dominating).
          Rounded-b: matches lid corner-radius treatment for visual continuity. */}
      <div
        aria-hidden="true"
        className={cn(
          'relative -mt-[2px] h-[14px] w-[102%] rounded-b-[14px]',
          'shadow-[0_6px_12px_-2px_var(--af-ink-glow-16,rgba(1,14,38,0.16))]',
          // Subtle gradient — top edge slightly darker (hinge crease) → lighter base
          'before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:rounded-t-sm',
          // Hinge crease — darker top edge on dark variants; lighter on silver.
          variant === 'silver' ? 'before:bg-black/15' : 'before:bg-black/30',
          baseColor,
        )}
      />
      </div>
      {/* End sized wrapper — close after base so lid+base share width context. */}

      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[color:var(--af-ink-muted,#14233E)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * AfWallpaper — same AF-branded fallback used by iphone-chassis.
 * Status: [joe-proxy] — pending Damian validation. See iphone-chassis.tsx
 * for the canonical version. Duplicated here so macbook-pro-chassis can be
 * installed without iphone-chassis as a dependency.
 */
function AfWallpaper() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 22% 18%, rgba(140, 92, 246, 0.85) 0%, rgba(140, 92, 246, 0.0) 55%),
          radial-gradient(ellipse 50% 40% at 78% 82%, rgba(96, 165, 250, 0.75) 0%, rgba(96, 165, 250, 0.0) 60%),
          linear-gradient(135deg, #2a1f5c 0%, #1c1c4a 35%, #131a3a 65%, #0e1830 100%)
        `,
      }}
    >
      {/* Grid overlay — subtle 40px graph-paper texture.
          Fixed pixel size (NOT %): on a 16:10 aspect ratio, `8% 8%` makes the
          width-cells 1.6× the height-cells, so squares become rectangles. Joe
          flagged this on the iPhone variant 2026-05-17 — same fix applies here. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
