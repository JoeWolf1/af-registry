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
   * - `space-gray` (default) — dark frame, modern MacBook Pro
   * - `silver` — light frame
   */
  variant?: 'space-gray' | 'silver';
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

  const frameColor =
    variant === 'space-gray'
      ? 'bg-[color:var(--af-ink,#010E26)] border-[color:var(--af-ink-muted,#14233E)]'
      : 'bg-[#D7D9DD] border-[#B3B6BC]'; // Apple-canon silver tone (Joe-proxy)

  const baseColor =
    variant === 'space-gray'
      ? 'bg-[color:var(--af-ink-muted,#14233E)]'
      : 'bg-[#C0C3C8]';

  const hingeColor =
    variant === 'space-gray'
      ? 'bg-[color:var(--af-ink,#010E26)]'
      : 'bg-[#A8ABB2]';

  const wallpaperEl: ReactNode =
    wallpaper === 'none'
      ? null
      : wallpaper === 'af'
        ? <AfWallpaper />
        : wallpaper;

  return (
    <figure className={cn('flex flex-col items-center gap-2', className)} {...rest}>
      {/* ---- Lid (screen) ---- */}
      <div
        className={cn(
          // Lid outer frame — 16:10 aspect ratio (canonical MacBook Pro display)
          'relative aspect-[16/10] rounded-[18px] border-[3px]',
          'shadow-[0_30px_80px_-12px_var(--af-ink-glow-30,rgba(1,14,38,0.30)),0_12px_32px_-4px_var(--af-pulse-glow-12,rgba(96,165,250,0.12))]',
          sizeClasses,
          frameColor,
        )}
      >
        {/* Inner screen — bezel + content */}
        <div
          className={cn(
            'absolute inset-[10px] overflow-hidden rounded-[10px]',
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

          {/* Screen content slot — over wallpaper at z-10 */}
          <div className={cn('relative z-10 h-full w-full', !immersive && 'pt-5')}>
            {children}
          </div>
        </div>
      </div>

      {/* ---- Hinge + base strip ---- */}
      {/* Subtle horizontal strip beneath lid suggests the laptop base without */}
      {/* drawing a full keyboard. Width matches lid bottom; height ~2% of lid. */}
      <div
        aria-hidden="true"
        className={cn('relative flex flex-col items-center', sizeClasses)}
      >
        {/* Hinge — thin dark line right under lid */}
        <div className={cn('h-[3px] w-[60%] rounded-b-sm', hingeColor)} />
        {/* Base — slightly wider, suggests the trackpad/keyboard plane */}
        <div
          className={cn(
            'h-[6px] w-[110%] rounded-b-[10px] shadow-[0_4px_8px_-2px_var(--af-ink-glow-16,rgba(1,14,38,0.16))]',
            baseColor,
          )}
        />
      </div>

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
