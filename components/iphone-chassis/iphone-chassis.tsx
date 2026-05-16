/**
 * iPhone Chassis — reusable device frame for AF surfaces.
 *
 * The canonical device-mock for displaying mobile-medium content (WhatsApp
 * messages, Reels feeds, native app screens, voice messages). Lifted from
 * the zusammenarbeit.anfragenfluss.de pattern per af-brand-doctrine §
 * "1:1 nachbauen / klauen" authority.
 *
 * Source of truth: af-brand-doctrine § 2. Three-phase iPhone hero
 *                  + ~/Anfragenfluss-style/audits/iphone-as-content-vehicle.md
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/iphone-chassis.json
 *
 * Usage:
 *   <IPhoneChassis caption="Hans Bauer @ HOBA">
 *     <WhatsAppChat ... />
 *   </IPhoneChassis>
 *
 *   // With no children, the AF-branded wallpaper renders as the standard fallback:
 *   <IPhoneChassis caption="AF visual" />
 *
 *   // Disable wallpaper for full custom screens:
 *   <IPhoneChassis wallpaper="none">
 *     <FullCustomScreen />
 *   </IPhoneChassis>
 *
 * IMPORTANT — before using this on a real AF surface with specific content,
 * the preflight-device-mock skill MUST fire (brand-wide rule). The skill
 * enforces the chassis + content matching, accurate device dimensions, and
 * realistic content rendering. See ~/.claude/skills/preflight-device-mock.
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface IPhoneChassisProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Screen content — what appears inside the device frame. Optional; AF wallpaper renders as fallback. */
  children?: ReactNode;
  /** Optional caption below the device — e.g. customer name + company. */
  caption?: ReactNode;
  /**
   * Visual variant for the device frame:
   * - `ink` (default) — dark frame, off-white inner bezel — Damian's canonical
   * - `paper` — light frame, for surfaces sitting on dark backgrounds
   */
  variant?: 'ink' | 'paper';
  /**
   * Device size class — controls overall scale.
   * - `compact` — for inline use in grids (~280px wide, fixed)
   * - `default` — standard (~360px wide on md+, fixed)
   * - `hero` — large hero use (~440px wide on md+, fixed)
   * - `fluid` — viewport-aware. Height set to `min(88vh, 920px)`; width
   *   auto-derives via aspect-ratio. Bigger-than-default visual on tall
   *   viewports, scales down on shorter ones, NEVER clips. Use for sticky
   *   pinned contexts (three-phase iPhone hero) where the iPhone must fit
   *   the visible viewport regardless of screen height.
   */
  size?: 'compact' | 'default' | 'hero' | 'fluid';
  /**
   * When true, hides the notch + status bar.
   * Use for content that needs to fill the screen edge-to-edge (e.g. full-bleed video).
   */
  immersive?: boolean;
  /**
   * Screen wallpaper rendered BEHIND children:
   * - `'af'` (default) — AF-branded wallpaper (purple→blue gradient + grid + glow spots).
   *   Status [joe-proxy] — Damian validation pending. Override with explicit children to hide.
   * - `'none'` — no wallpaper, fully transparent screen background.
   * - ReactNode — custom wallpaper element.
   *
   * Children, when provided, render OVER the wallpaper. Pass `wallpaper="none"` if the
   * children fill the screen and you want zero overhead from the fallback layer.
   */
  wallpaper?: 'af' | 'none' | ReactNode;
}

export function IPhoneChassis({
  children,
  caption,
  variant = 'ink',
  size = 'default',
  immersive = false,
  wallpaper = 'af',
  className,
  ...rest
}: IPhoneChassisProps) {
  // Fixed sizes set width; aspect-[9/19.5] derives height.
  // `fluid` sets height instead; aspect-ratio derives width — never clips
  // because the iPhone scales DOWN on short viewports.
  const sizeClasses = {
    compact: 'w-[280px]',
    default: 'w-[320px] md:w-[360px]',
    hero: 'w-[360px] md:w-[440px]',
    fluid: 'h-[min(88vh,920px)]',
  }[size];

  const frameColor =
    variant === 'ink'
      ? 'bg-[color:var(--af-ink,#010E26)] border-[color:var(--af-ink-muted,#14233E)]'
      : 'bg-[color:var(--af-paper,#FFFFFF)] border-[color:var(--af-border-strong,rgba(1,14,38,0.20))]';

  const wallpaperEl: ReactNode =
    wallpaper === 'none'
      ? null
      : wallpaper === 'af'
        ? <AfWallpaper />
        : wallpaper;

  return (
    <figure className={cn('flex flex-col items-center gap-4', className)} {...rest}>
      <div
        className={cn(
          // Device-frame outer — rounded rectangle, AF brand-canon dimensions ~9:19.5 aspect
          'relative aspect-[9/19.5] rounded-[44px] border-[3px]',
          'shadow-[0_20px_60px_-10px_var(--af-ink-glow-30,rgba(1,14,38,0.30)),0_8px_24px_-4px_var(--af-pulse-glow-12,rgba(96,165,250,0.12))]',
          sizeClasses,
          frameColor,
        )}
      >
        {/* Screen — inner bezel + content */}
        <div
          className={cn(
            'absolute inset-[6px] overflow-hidden rounded-[38px]',
            'bg-[color:var(--af-paper,#FFFFFF)]',
          )}
        >
          {/* Wallpaper layer — sits BEHIND children (z-0) */}
          {wallpaperEl && (
            <div className="absolute inset-0 z-0" aria-hidden="true">
              {wallpaperEl}
            </div>
          )}

          {/* Notch — Dynamic-Island style, omitted in immersive mode */}
          {!immersive && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute left-1/2 top-3 z-20 -translate-x-1/2',
                'h-[26px] w-[100px] rounded-full',
                'bg-[color:var(--af-ink,#010E26)]',
              )}
            />
          )}

          {/* Status bar — minimal, time-of-day; omitted in immersive mode */}
          {!immersive && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute left-0 right-0 top-0 z-10',
                'flex items-center justify-between',
                'px-7 pt-[14px] text-[11px] font-semibold',
                // Use white text when AF wallpaper is on (it's dark); ink otherwise
                wallpaper === 'af'
                  ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                  : 'text-[color:var(--af-ink,#010E26)]',
              )}
            >
              <span>9:41</span>
              <span className="opacity-80">●●●●</span>
            </div>
          )}

          {/* Screen content slot — renders OVER the wallpaper (z-10) */}
          <div className={cn('relative z-10 h-full w-full', !immersive && 'pt-12')}>
            {children}
          </div>
        </div>

        {/* Side buttons — visual fidelity flourish */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[-3px] top-[110px] h-[28px] w-[3px] rounded-l-sm',
            variant === 'ink' ? 'bg-[color:var(--af-ink-muted,#14233E)]' : 'bg-[color:var(--af-border-strong,rgba(1,14,38,0.30))]',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[-3px] top-[156px] h-[48px] w-[3px] rounded-l-sm',
            variant === 'ink' ? 'bg-[color:var(--af-ink-muted,#14233E)]' : 'bg-[color:var(--af-border-strong,rgba(1,14,38,0.30))]',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[-3px] top-[216px] h-[48px] w-[3px] rounded-l-sm',
            variant === 'ink' ? 'bg-[color:var(--af-ink-muted,#14233E)]' : 'bg-[color:var(--af-border-strong,rgba(1,14,38,0.30))]',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'absolute right-[-3px] top-[140px] h-[76px] w-[3px] rounded-r-sm',
            variant === 'ink' ? 'bg-[color:var(--af-ink-muted,#14233E)]' : 'bg-[color:var(--af-border-strong,rgba(1,14,38,0.30))]',
          )}
        />
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[color:var(--af-ink-muted,#14233E)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * AfWallpaper — the AF-canonical iPhone wallpaper.
 *
 * Status: [joe-proxy] — Joe-set fallback per directive 2026-05-17 with reference
 * image showing purple-violet upper-left → AF-pulse-blue lower-right gradient
 * with subtle grid overlay + two ambient glow spots. The PURPLE hue is not
 * formally in AF canon yet (canon is Ink-Paper-Pulse + AFVQ-blue + Liquid-Glass);
 * queued for Damian validation at ~/.claude/skills/af-design-catalog/PENDING-DAMIAN-VALIDATION.md.
 *
 * Composition:
 *   - Base linear-gradient: deep purple → deep navy → deep blue (135deg)
 *   - Two radial glow spots: violet at top-left, AF-pulse at bottom-right
 *   - Subtle 40px grid overlay at low opacity
 */
export function AfWallpaper() {
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
      {/* Grid overlay — subtle 40px graph-paper texture */}
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
