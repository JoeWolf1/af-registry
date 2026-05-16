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
  /** Screen content — what appears inside the device frame. */
  children: ReactNode;
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
   * - `compact` — for inline use in grids (~280px wide)
   * - `default` — standard (~360px wide on md+)
   * - `hero` — large hero use (~440px wide on md+)
   */
  size?: 'compact' | 'default' | 'hero';
  /**
   * When true, hides the notch + status bar.
   * Use for content that needs to fill the screen edge-to-edge (e.g. full-bleed video).
   */
  immersive?: boolean;
}

export function IPhoneChassis({
  children,
  caption,
  variant = 'ink',
  size = 'default',
  immersive = false,
  className,
  ...rest
}: IPhoneChassisProps) {
  const sizeClasses = {
    compact: 'w-[280px]',
    default: 'w-[320px] md:w-[360px]',
    hero: 'w-[360px] md:w-[440px]',
  }[size];

  const frameColor =
    variant === 'ink'
      ? 'bg-[color:var(--af-ink,#010E26)] border-[color:var(--af-ink-muted,#14233E)]'
      : 'bg-[color:var(--af-paper,#FFFFFF)] border-[color:var(--af-border-strong,rgba(1,14,38,0.20))]';

  return (
    <figure className={cn('flex flex-col items-center gap-4', className)} {...rest}>
      <div
        className={cn(
          // Device-frame outer — rounded rectangle, AF brand-canon dimensions ~9:19.5 aspect
          'relative aspect-[9/19.5] rounded-[44px] border-[3px] shadow-2xl',
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
                'text-[color:var(--af-ink,#010E26)]',
              )}
            >
              <span>9:41</span>
              <span className="opacity-80">●●●●</span>
            </div>
          )}

          {/* Screen content slot */}
          <div className={cn('relative h-full w-full', !immersive && 'pt-12')}>
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
