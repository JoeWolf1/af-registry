/**
 * AF iOS Notification — iOS-style notification banner with Liquid-Glass container.
 *
 * Drops cleanly into iphone-chassis screens AS notification overlays, OR can
 * be used standalone on web/app surfaces. Uses liquid-glass-frame as the
 * container so the banner morphs with whatever's behind it (per Joe directive
 * 2026-05-17 on Liquid-Glass as a cross-surface UI element).
 *
 * Anatomy (matches iOS 17+ banner):
 *   [Icon] APP NAME • TIME
 *   Title (bold)
 *   Body text (1-2 lines)
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/liquid-glass-frame.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-ios-notification.json
 *
 * Pairs naturally with `af-platform-icons` for the icon slot (Gmail/WhatsApp/
 * FB/IG/etc.) but accepts any ReactNode in the icon slot — pass a customer
 * avatar, a brand mark, anything 32-40px square.
 *
 * Usage:
 *   <AfIosNotification
 *     icon={<WhatsAppIcon size={36} />}
 *     appName="WhatsApp"
 *     time="now"
 *     title="Hans Bauer"
 *     body="Anfragenfluss hat unsere Lead-Pipeline transformiert."
 *   />
 *
 *   // Inside an iPhone chassis as an overlay
 *   <IPhoneChassis>
 *     <div className="flex items-start justify-center pt-20 px-3">
 *       <AfIosNotification ... />
 *     </div>
 *   </IPhoneChassis>
 *
 *   // Stacked notifications (iOS group)
 *   <div className="flex flex-col gap-2">
 *     <AfIosNotification ... />
 *     <AfIosNotification ... />
 *   </div>
 */

import { type ReactNode } from 'react';
import { LiquidGlassFrame } from '@/components/af/liquid-glass-frame';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface AfIosNotificationProps {
  /** App icon — typically 36×36px. Pass any ReactNode (af-platform-icons, avatar, brand mark). */
  icon: ReactNode;
  /** App name shown in the eyebrow (small caps, with the time). */
  appName: string;
  /** Time shown to the right of the app name (e.g. "now", "2m ago", "9:41"). */
  time?: string;
  /** Notification title — bold, primary line. */
  title: string;
  /** Notification body — 1-2 lines of supporting copy. Optional. */
  body?: ReactNode;
  /**
   * Tint behavior:
   * - `auto` (default) — Liquid-Glass auto tint, works on most backdrops
   * - `light` — biased brighter (for use on dark backdrops/wallpapers)
   * - `dark` — biased toward ink (for use on bright/light backdrops)
   *
   * On AF wallpaper (dark) → use `light` for best readability.
   * On AFVQ-card hovers (white) → use `dark`.
   */
  tint?: 'auto' | 'light' | 'dark';
  /** Optional extra classes on the wrapper. */
  className?: string;
}

export function AfIosNotification({
  icon,
  appName,
  time,
  title,
  body,
  tint = 'auto',
  className,
}: AfIosNotificationProps) {
  // Text color adapts to tint — light tint = dark backdrop = white text,
  // dark tint = light backdrop = dark text, auto = mid-contrast white text.
  const textColor = {
    auto: 'text-white',
    light: 'text-white',
    dark: 'text-[color:var(--af-ink,#010E26)]',
  }[tint];

  const eyebrowColor = {
    auto: 'text-white/75',
    light: 'text-white/80',
    dark: 'text-[color:var(--af-ink-muted,#14233E)]',
  }[tint];

  const bodyColor = {
    auto: 'text-white/90',
    light: 'text-white/90',
    dark: 'text-[color:var(--af-ink-muted,#14233E)]',
  }[tint];

  return (
    <LiquidGlassFrame
      intensity="default"
      shape="card"
      tint={tint}
      className={cn('w-full max-w-[340px] p-3', className)}
    >
      <div className="flex items-start gap-3">
        {/* Icon — fixed 36px square */}
        <div className="flex-shrink-0 h-9 w-9 overflow-hidden rounded-[8px]">
          {icon}
        </div>

        {/* Text column */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow — app name + time */}
          <div className={cn(
            'flex items-center justify-between text-[10px] font-medium uppercase tracking-wider',
            eyebrowColor,
          )}>
            <span className="truncate">{appName}</span>
            {time && <span className="opacity-90 normal-case tracking-normal">{time}</span>}
          </div>

          {/* Title */}
          <div className={cn('mt-0.5 text-sm font-semibold leading-tight truncate', textColor)}>
            {title}
          </div>

          {/* Body — capped at 2 lines */}
          {body && (
            <div
              className={cn('mt-0.5 text-xs leading-snug', bodyColor)}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {body}
            </div>
          )}
        </div>
      </div>
    </LiquidGlassFrame>
  );
}
