/**
 * AF Platform Icons — recognizable platform/app brand icons as SVG components.
 *
 * Each icon is a simplified, identifiable representation of a major platform
 * AF works with or appears alongside (Gmail, WhatsApp, FB, IG, Telegram, etc.).
 * Geometric resemblances — NOT literal copyrighted logos. Safe for AF surfaces
 * and customer mockups.
 *
 * Used by:
 *   - af-ios-notification (icon slot)
 *   - Future: content surfaces (WhatsApp Chat header avatar, IG profile, etc.)
 *   - Directly in AF UIs where platform attribution is needed
 *
 * Each icon:
 *   - Accepts standard SVG props (size, className, style)
 *   - Renders at 24×24 by default (sized via the `size` prop or className)
 *   - Uses authentic brand colors as defaults; override via fill/className
 *   - Inline SVG — no external assets, no network requests, no icon-font deps
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-platform-icons.json
 *
 * Usage:
 *   import { WhatsAppIcon, GmailIcon, InstagramIcon } from '@/components/af/af-platform-icons';
 *
 *   <WhatsAppIcon size={36} />
 *   <GmailIcon className="h-8 w-8" />
 *   <InstagramIcon size={24} aria-label="Instagram" />
 */

import { type SVGProps } from 'react';

export interface PlatformIconProps extends SVGProps<SVGSVGElement> {
  /** Icon size in pixels (sets both width and height). Default: 24. */
  size?: number;
}

function svgProps({ size = 24, ...rest }: PlatformIconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    role: 'img',
    'aria-hidden': rest['aria-label'] ? undefined : true,
    ...rest,
  };
}

// ----------------------------------------------------------------------------
// WhatsApp — green chat bubble with phone
// ----------------------------------------------------------------------------
export function WhatsAppIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect width="64" height="64" rx="14" fill="#25D366" />
      <path
        d="M32 14c-9.94 0-18 8.06-18 18 0 3.17.83 6.27 2.4 8.97L14 50l9.21-2.4A17.94 17.94 0 0 0 32 50c9.94 0 18-8.06 18-18s-8.06-18-18-18Zm0 32.4c-2.65 0-5.25-.7-7.52-2.04l-.54-.32-5.47 1.43 1.46-5.34-.35-.55A14.4 14.4 0 1 1 32 46.4Zm7.86-10.78c-.43-.21-2.55-1.26-2.95-1.4-.4-.14-.69-.21-.97.22-.29.43-1.12 1.4-1.37 1.69-.25.29-.5.32-.93.11-.43-.21-1.82-.67-3.46-2.13a13 13 0 0 1-2.39-2.97c-.25-.43-.03-.66.19-.87.2-.2.43-.5.65-.76.21-.25.29-.43.43-.72.14-.29.07-.54-.04-.76-.11-.21-.97-2.33-1.32-3.19-.35-.84-.7-.72-.97-.74-.25-.01-.54-.01-.83-.01-.29 0-.76.11-1.16.54-.4.43-1.51 1.47-1.51 3.6 0 2.12 1.55 4.16 1.76 4.45.21.29 3.04 4.65 7.37 6.52 1.03.44 1.84.71 2.46.91.69.22 1.31.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.08-.13-.27-.21-.55-.34Z"
        fill="#fff"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Gmail — red envelope on white
// ----------------------------------------------------------------------------
export function GmailIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect width="64" height="64" rx="14" fill="#fff" />
      <path
        d="M14 22c0-1.66 1.34-3 3-3h3.5l11.5 9 11.5-9H47c1.66 0 3 1.34 3 3v20c0 1.66-1.34 3-3 3h-4V31l-11 8.5L21 31v14h-4c-1.66 0-3-1.34-3-3V22Z"
        fill="#EA4335"
      />
      <path d="M14 22v20c0 1.66 1.34 3 3 3h4V31l-7-9Z" fill="#C5221F" />
      <path d="M50 22v20c0 1.66-1.34 3-3 3h-4V31l7-9Z" fill="#34A853" />
      <path d="M43 19h4c1.66 0 3 1.34 3 3l-7 5.5V19Z" fill="#FBBC04" />
      <path d="M21 19h-4c-1.66 0-3 1.34-3 3l7 5.5V19Z" fill="#4285F4" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Facebook — blue F
// ----------------------------------------------------------------------------
export function FacebookIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect width="64" height="64" rx="14" fill="#1877F2" />
      <path
        d="M36 34h6l1-7h-7v-4.5c0-2 .5-3.5 3.5-3.5H43V12c-.5-.07-2.3-.25-4.4-.25-4.4 0-7.6 2.7-7.6 7.5V27h-6v7h6v19h7V34Z"
        fill="#fff"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Instagram — gradient with camera outline
// ----------------------------------------------------------------------------
export function InstagramIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="70%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#ig-grad)" />
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="9"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="42" cy="22" r="2" fill="#fff" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Telegram — blue paper plane
// ----------------------------------------------------------------------------
export function TelegramIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <defs>
        <linearGradient id="tg-grad" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#37BBFE" />
          <stop offset="100%" stopColor="#007DBB" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#tg-grad)" />
      <path
        d="M14.5 31.5 47.6 18.4c1.5-.5 2.9.4 2.4 2.5L44.4 47c-.4 1.7-1.4 2.1-2.8 1.3l-7.7-5.7-3.7 3.6c-.4.4-.8.8-1.6.8l.6-8.2 14.9-13.5c.65-.57-.14-.9-1-.34L24.7 35.4l-7.9-2.5c-1.7-.5-1.7-1.7-.3-2.4Z"
        fill="#fff"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// iMessage — green chat bubble (Apple Messages)
// ----------------------------------------------------------------------------
export function iMessageIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <defs>
        <linearGradient id="im-grad" x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5BF675" />
          <stop offset="100%" stopColor="#0CBD3E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#im-grad)" />
      <path
        d="M32 14c-9.94 0-18 6.72-18 15 0 4.46 2.34 8.47 6.04 11.21L18 50l9.69-3.55c1.4.23 2.84.35 4.31.35 9.94 0 18-6.72 18-15s-8.06-15-18-15Z"
        fill="#fff"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Phone — green call icon
// ----------------------------------------------------------------------------
export function PhoneIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect width="64" height="64" rx="14" fill="#34C759" />
      <path
        d="M44.4 36.6c-2-1.05-4.5-1.85-5.8-1.05-1.05.6-1.7 2.1-3 1.85-2.3-.5-7-4.9-7.5-7.2-.25-1.3 1.25-1.95 1.85-3 .8-1.3 0-3.8-1.05-5.8-1.05-1.95-2.4-3.1-3.7-3.1-1.05 0-2.05.65-3 2.05C20.8 22 21.8 27 27 34.5 32.2 42 38 45.7 42 44.4c1.4-.45 2.05-1.45 2.05-2.5 0-1.3-1.15-2.65-3.1-3.7Z"
        fill="#fff"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Mail — generic envelope (system-tier alt to Gmail)
// ----------------------------------------------------------------------------
export function MailIcon(props: PlatformIconProps) {
  return (
    <svg {...svgProps(props)}>
      <defs>
        <linearGradient id="mail-grad" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#mail-grad)" />
      <path
        d="M14 24c0-1.66 1.34-3 3-3h30c1.66 0 3 1.34 3 3v16c0 1.66-1.34 3-3 3H17c-1.66 0-3-1.34-3-3V24Z"
        fill="#fff"
      />
      <path
        d="M14 24 32 36l18-12v-2c0-.42-.09-.83-.25-1.2L32 33 14.25 20.8c-.16.37-.25.78-.25 1.2v2Z"
        fill="#E8F0FF"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Convenience export — name-keyed registry for dynamic icon selection
// ----------------------------------------------------------------------------
export const AfPlatformIcons = {
  whatsapp: WhatsAppIcon,
  gmail: GmailIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  imessage: iMessageIcon,
  phone: PhoneIcon,
  mail: MailIcon,
} as const;

export type PlatformIconName = keyof typeof AfPlatformIcons;
