/**
 * WhatsApp Chat — content surface for AF iPhone-chassis embeds.
 *
 * Designed to look like an authentic WhatsApp conversation so customers
 * recognize the medium instantly. Pairs with iphone-chassis as the screen
 * content for testimonial / lead-conversation use cases. Per af-brand-doctrine
 * "WhatsApp-as-trust-medium" pattern.
 *
 * Visual contract — these match real WhatsApp specs (NOT AF tokens) because
 * the recognizability of the medium is the whole point. AF tokens used only
 * on the figure/caption wrapper outside the chassis screen.
 *
 *   Outgoing bubble bg:  #D9FDD3 (modern light-mode green)
 *   Outgoing tail color: matches bubble
 *   Incoming bubble bg:  #FFFFFF
 *   Header bg:           #008069 (WhatsApp teal-green)
 *   Header text:         #FFFFFF
 *   Background:          #ECE5DD with subtle pattern
 *   Read receipts:       #53BDEB (blue double check)
 *   Time text:           rgba(0, 0, 0, 0.45)
 *
 * Usage:
 *   <IPhoneChassis immersive wallpaper="none">
 *     <WhatsAppChat
 *       contact={{ name: "Hans Bauer", subtitle: "HOBA Solar", lastSeen: "online" }}
 *       messages={[
 *         { from: "incoming", text: "Habt ihr noch Kapazitäten im Mai?", time: "9:32" },
 *         { from: "outgoing", text: "Ja, schick mir die Anfrage rüber.", time: "9:34", receipt: "read" },
 *       ]}
 *     />
 *   </IPhoneChassis>
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/whatsapp-chat.json
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type WhatsAppReceipt = 'sent' | 'delivered' | 'read';

export interface WhatsAppMessage {
  /** Which side of the chat the bubble sits on. */
  from: 'incoming' | 'outgoing';
  /** Message body. Can be text OR a custom node (voice message, image, etc.). */
  text?: string;
  /** Display time (e.g. "9:32"). Lives bottom-right of the bubble. */
  time?: string;
  /** Read state for outgoing messages only. Ignored on incoming. */
  receipt?: WhatsAppReceipt;
  /** Optional custom content slot — overrides text for voice/image/etc. */
  children?: ReactNode;
}

export interface WhatsAppContact {
  /** Display name in the header. */
  name: string;
  /** Subtitle below the name — typically a company or status. */
  subtitle?: string;
  /** Online state — "online", "tippt..." (typing), "zuletzt online heute um 9:32", etc. */
  lastSeen?: string;
  /** Avatar URL or initial. If omitted, uses initials of `name`. */
  avatar?: string;
}

export interface WhatsAppChatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  contact: WhatsAppContact;
  messages: WhatsAppMessage[];
  /** Day separator chip ("Heute", "Gestern", date string). Renders above first message. */
  daySeparator?: string;
  /** When true, renders a "tippt..." typing indicator after last message. */
  isTyping?: boolean;
  /** Optional placeholder text for the input bar. */
  inputPlaceholder?: string;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export function WhatsAppChat({
  contact,
  messages,
  daySeparator,
  isTyping = false,
  inputPlaceholder = 'Nachricht schreiben',
  className,
  ...rest
}: WhatsAppChatProps) {
  return (
    <div
      className={cn('flex h-full w-full flex-col', className)}
      style={{ background: '#ECE5DD' }}
      {...rest}
    >
      <WhatsAppHeader contact={contact} />
      <WhatsAppBackground>
        {daySeparator && <WhatsAppDaySeparator>{daySeparator}</WhatsAppDaySeparator>}
        {messages.map((msg, i) => (
          <WhatsAppBubble key={i} message={msg} />
        ))}
        {isTyping && <WhatsAppTypingIndicator />}
      </WhatsAppBackground>
      <WhatsAppInputBar placeholder={inputPlaceholder} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components — exported so consumers can compose custom flows
// -----------------------------------------------------------------------------

/** Header strip — WhatsApp teal background with avatar + name + last-seen. */
export function WhatsAppHeader({ contact }: { contact: WhatsAppContact }) {
  const initials = contact.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-3 px-3 pt-12 pb-2.5"
      style={{ background: '#008069', color: '#FFFFFF' }}
    >
      {/* Back chevron */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Avatar */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{
          background: contact.avatar ? `url(${contact.avatar}) center/cover` : 'rgba(255, 255, 255, 0.22)',
          color: '#FFFFFF',
        }}
      >
        {!contact.avatar && initials}
      </div>

      {/* Name + last-seen */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-[15px] font-semibold leading-tight">
          {contact.name}
          {contact.subtitle && (
            <span className="ml-1.5 font-normal opacity-85 text-[13px]">· {contact.subtitle}</span>
          )}
        </div>
        {contact.lastSeen && (
          <div className="truncate text-[11.5px] opacity-85 leading-tight mt-0.5">{contact.lastSeen}</div>
        )}
      </div>

      {/* Video + Call + Menu icons */}
      <div className="flex items-center gap-3.5 pr-1">
        <svg width="20" height="18" viewBox="0 0 24 22" fill="#FFFFFF" aria-hidden="true">
          <path d="M17 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5l4 3.5v-8l-4 3.5z" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
          <path d="M19.23 15.26l-2.54-.29a2 2 0 0 0-1.75.6l-1.84 1.83a15.05 15.05 0 0 1-6.59-6.6L8.35 9a2 2 0 0 0 .6-1.75l-.29-2.53a2 2 0 0 0-2-1.77H3.03c-1.13 0-2.07.93-2 2.06.43 8.51 7.24 15.32 15.75 15.75 1.13.07 2.06-.87 2.06-2v-3.51a2 2 0 0 0-1.61-1.99z" />
        </svg>
        <svg width="4" height="16" viewBox="0 0 4 16" fill="#FFFFFF" aria-hidden="true">
          <circle cx="2" cy="2" r="2" />
          <circle cx="2" cy="8" r="2" />
          <circle cx="2" cy="14" r="2" />
        </svg>
      </div>
    </div>
  );
}

/** Scrollable message body with WhatsApp's subtle background pattern. */
export function WhatsAppBackground({ children }: { children: ReactNode }) {
  // The pattern is a faint repeating SVG; we encode it inline so the component
  // is fully self-contained (no external image assets to manage).
  const patternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><path d="M30 5l8 8-8 8-8-8 8-8zm0 30l8 8-8 8-8-8 8-8z" fill="%23000" fill-opacity="0.025"/></svg>`;
  const patternUrl = `url("data:image/svg+xml;utf8,${patternSvg.replace(/"/g, "'")}")`;

  return (
    <div
      className="flex-1 overflow-y-auto px-2.5 py-2 flex flex-col gap-1"
      style={{
        background: `${patternUrl}, #ECE5DD`,
        backgroundSize: '60px 60px, auto',
      }}
    >
      {children}
    </div>
  );
}

/** Day-separator chip — centered grey pill above first message of the day. */
export function WhatsAppDaySeparator({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center my-2">
      <div
        className="px-3 py-1 rounded-md text-[11.5px] font-medium"
        style={{
          background: 'rgba(225, 245, 254, 0.92)',
          color: 'rgba(0, 0, 0, 0.65)',
          boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** One message bubble — incoming (left, white) or outgoing (right, green). */
export function WhatsAppBubble({ message }: { message: WhatsAppMessage }) {
  const isOutgoing = message.from === 'outgoing';
  const bg = isOutgoing ? '#D9FDD3' : '#FFFFFF';
  const tailSide = isOutgoing ? 'right' : 'left';

  return (
    <div className={cn('flex', isOutgoing ? 'justify-end' : 'justify-start')}>
      <div
        className="relative max-w-[78%] rounded-lg px-2 py-1 pb-1.5"
        style={{
          background: bg,
          boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
          borderTopLeftRadius: tailSide === 'left' ? 0 : undefined,
          borderTopRightRadius: tailSide === 'right' ? 0 : undefined,
        }}
      >
        {/* Tail — a small triangle pointing up-left or up-right matching the bubble color */}
        <span
          aria-hidden="true"
          className="absolute top-0 h-0 w-0"
          style={{
            [tailSide]: -6,
            borderTop: `8px solid ${bg}`,
            borderLeft: tailSide === 'right' ? '6px solid transparent' : 'none',
            borderRight: tailSide === 'left' ? '6px solid transparent' : 'none',
          } as React.CSSProperties}
        />

        {/* Content */}
        <div className="pr-12 pl-1 text-[14.5px] leading-snug" style={{ color: '#111B21' }}>
          {message.children ?? message.text}
        </div>

        {/* Time + read receipt (bottom-right of bubble) */}
        <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10.5px]" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
          {message.time && <span>{message.time}</span>}
          {isOutgoing && message.receipt && <WhatsAppReceiptIcon receipt={message.receipt} />}
        </div>
      </div>
    </div>
  );
}

/** Single/double tick read-receipt icon. Blue when "read". */
function WhatsAppReceiptIcon({ receipt }: { receipt: WhatsAppReceipt }) {
  const color = receipt === 'read' ? '#53BDEB' : 'rgba(0, 0, 0, 0.45)';
  if (receipt === 'sent') {
    // Single tick
    return (
      <svg width="14" height="10" viewBox="0 0 16 11" fill="none" aria-hidden="true">
        <path d="M1 5.5l3.5 4L14 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Double tick (delivered or read; color differs)
  return (
    <svg width="16" height="10" viewBox="0 0 18 11" fill="none" aria-hidden="true">
      <path d="M1 5.5l3.5 4L11 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5.5l3.5 4L17 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Animated "tippt..." typing indicator — three pulsing dots in an incoming bubble. */
export function WhatsAppTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="relative rounded-lg px-3 py-2.5"
        style={{
          background: '#FFFFFF',
          borderTopLeftRadius: 0,
          boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
        }}
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                animation: `wa-typing 1.2s ${i * 0.15}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes wa-typing {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-2px); }
          }
        `}</style>
      </div>
    </div>
  );
}

/** Bottom input bar — emoji + text input + attachment + mic/send. */
export function WhatsAppInputBar({ placeholder }: { placeholder: string }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-2"
      style={{ background: '#F0F2F5', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}
    >
      {/* Input pill containing emoji + text + attach + camera */}
      <div
        className="flex flex-1 items-center gap-2 rounded-full px-3 py-2"
        style={{ background: '#FFFFFF', boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.06)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" stroke="#54656F" strokeWidth="1.5" />
          <circle cx="9" cy="10" r="1" fill="#54656F" />
          <circle cx="15" cy="10" r="1" fill="#54656F" />
          <path d="M8 14.5c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" stroke="#54656F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="flex-1 text-[14.5px]" style={{ color: '#54656F' }}>
          {placeholder}
        </span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16.5 6.5l-6 6a2 2 0 0 0 2.8 2.8l7-7a4 4 0 0 0-5.6-5.6l-7 7a6 6 0 0 0 8.4 8.4l6-6" stroke="#54656F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656F" aria-hidden="true">
          <path d="M20 5h-3.2L15 3H9L7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
        </svg>
      </div>

      {/* Mic / send button */}
      <button
        type="button"
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: '#008069' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
          <path d="M12 14a2 2 0 0 0 2-2V5a2 2 0 0 0-4 0v7a2 2 0 0 0 2 2z" />
          <path d="M17 12a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H8v1h8v-1h-3v-2.08A7 7 0 0 0 19 12h-2z" />
        </svg>
      </button>
    </div>
  );
}

/** Voice-message tile — slot into a bubble. Shows mic + waveform + duration. */
export function WhatsAppVoiceMessage({
  durationSeconds,
  from = 'incoming',
}: {
  durationSeconds: number;
  from?: 'incoming' | 'outgoing';
}) {
  const mins = Math.floor(durationSeconds / 60);
  const secs = String(durationSeconds % 60).padStart(2, '0');
  const accent = from === 'outgoing' ? '#075E54' : '#008069';

  return (
    <div className="flex items-center gap-2 py-1 min-w-[200px]">
      {/* Mic icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill={accent} aria-hidden="true">
        <path d="M12 14a2 2 0 0 0 2-2V5a2 2 0 0 0-4 0v7a2 2 0 0 0 2 2z" />
        <path d="M17 12a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-3.08A7 7 0 0 0 19 12h-2z" />
      </svg>
      {/* Play button */}
      <button
        type="button"
        aria-label="Play voice message"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: accent }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="#FFFFFF" aria-hidden="true">
          <path d="M2 1l7 4-7 4V1z" />
        </svg>
      </button>
      {/* Waveform — simulated by stacked vertical bars of varying heights */}
      <div className="flex items-center gap-0.5 flex-1 h-6">
        {[3, 6, 4, 8, 5, 9, 4, 7, 5, 8, 3, 6, 4, 7, 5, 9, 6, 4, 8, 5, 7, 4, 9, 5, 6].map((h, i) => (
          <span
            key={i}
            className="rounded-full block"
            style={{
              width: 2,
              height: h * 2,
              background: i < 6 ? accent : 'rgba(0, 0, 0, 0.25)',
            }}
          />
        ))}
      </div>
      <span className="text-[11px]" style={{ color: 'rgba(0, 0, 0, 0.55)' }}>
        {mins}:{secs}
      </span>
    </div>
  );
}
