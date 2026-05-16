/**
 * Email Inbox — list-based content surface for AF iPhone-chassis embeds.
 *
 * Models the iOS Mail app inbox so the medium is instantly recognizable on an
 * iPhone chassis. Slots into iphone-chassis (immersive + wallpaper='none') for
 * lead-flow / pipeline demonstrations: AF showing real-feeling email arrivals
 * (Hans Bauer's reply, AFTM job completion, Stripe receipt, Wochenreport).
 *
 * Visual contract (iOS Mail conventions — NOT AF-overridable):
 *   Background:       #FFFFFF
 *   Section dividers: #C6C6C8 hairline
 *   Unread dot:       #007AFF (Apple system blue)
 *   Time text:        rgba(60, 60, 67, 0.6)
 *   Sender (unread):  #000000 semibold
 *   Sender (read):    #000000 regular
 *   Preview text:     rgba(60, 60, 67, 0.85)
 *   Status bar bg:    rgba(247, 247, 247, 0.94)
 *
 * Usage:
 *   <IPhoneChassis immersive wallpaper="none">
 *     <EmailInbox
 *       mailboxName="Posteingang"
 *       emails={[
 *         {
 *           sender: "Hans Bauer",
 *           subject: "Solar-Anfrage Bestätigung",
 *           preview: "Servus, danke für die schnelle Rückmeldung...",
 *           time: "9:32",
 *           unread: true,
 *         },
 *       ]}
 *     />
 *   </IPhoneChassis>
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/email-inbox.json
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface Email {
  /** Sender name (e.g. "Hans Bauer"). Bold when unread. */
  sender: string;
  /** Subject line. */
  subject: string;
  /** First-line preview snippet — truncates after ~2 lines. */
  preview?: string;
  /** Display time. "9:32" for today, "Gestern" for yesterday, "Mo." for older. */
  time: string;
  /** When true: blue unread dot + bold sender + bolder subject. */
  unread?: boolean;
  /** When true: orange flag icon shown next to time. */
  flagged?: boolean;
  /** When > 0: thread indicator next to subject (e.g. "(3)"). */
  threadCount?: number;
  /** Optional VIP/star marker (left of sender). */
  starred?: boolean;
  /** Avatar / sender initial bubble (color hint when shown). */
  avatarColor?: string;
}

export interface EmailSection {
  /** Section heading ("Heute", "Gestern", "Letzte Woche"). */
  title: string;
  emails: Email[];
}

export interface EmailInboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Mailbox title (defaults to "Posteingang"). */
  mailboxName?: string;
  /**
   * Either a flat list of emails OR a list of sections with their own emails.
   * If sections are provided, headings render between groups.
   */
  emails?: Email[];
  sections?: EmailSection[];
  /** When true, show a search bar below the title. */
  showSearch?: boolean;
  /** Filter chips below the search bar (e.g. "Alle", "Ungelesen", "Markiert"). */
  filters?: { label: string; active?: boolean; count?: number }[];
  /** Show a "Aktualisiert vor X Sek." footer at the bottom. */
  lastUpdated?: string;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export function EmailInbox({
  mailboxName = 'Posteingang',
  emails,
  sections,
  showSearch = false,
  filters,
  lastUpdated,
  className,
  ...rest
}: EmailInboxProps) {
  // Normalize input to sections for consistent rendering.
  const allSections: EmailSection[] = sections ?? (emails ? [{ title: '', emails }] : []);
  const totalUnread = allSections
    .flatMap((s) => s.emails)
    .filter((e) => e.unread).length;

  return (
    <div
      className={cn('flex h-full w-full flex-col font-[-apple-system,BlinkMacSystemFont,system-ui,sans-serif]', className)}
      style={{ background: '#FFFFFF', color: '#000000' }}
      {...rest}
    >
      {/* Header — iOS Mail style large title */}
      <EmailHeader mailboxName={mailboxName} unreadCount={totalUnread} />

      {/* Search */}
      {showSearch && <EmailSearchBar />}

      {/* Filter chips */}
      {filters && filters.length > 0 && <EmailFilterRow filters={filters} />}

      {/* Section + email list — scrollable */}
      <div className="flex-1 overflow-y-auto">
        {allSections.map((section, i) => (
          <div key={`section-${i}`}>
            {section.title && <EmailSectionDivider>{section.title}</EmailSectionDivider>}
            {section.emails.map((email, j) => (
              <EmailListItem key={`${i}-${j}`} email={email} isLast={j === section.emails.length - 1} />
            ))}
          </div>
        ))}
      </div>

      {/* Footer — "Aktualisiert..." */}
      {lastUpdated && (
        <div
          className="px-4 py-2.5 text-center text-[11px]"
          style={{
            color: 'rgba(60, 60, 67, 0.6)',
            background: 'rgba(247, 247, 247, 0.94)',
            borderTop: '0.5px solid #C6C6C8',
            backdropFilter: 'blur(20px)',
          }}
        >
          Aktualisiert {lastUpdated}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Header — iOS Mail large title with edit button
// -----------------------------------------------------------------------------

export function EmailHeader({
  mailboxName,
  unreadCount,
}: {
  mailboxName: string;
  unreadCount: number;
}) {
  return (
    <div className="px-4 pt-12 pb-2" style={{ background: '#FFFFFF' }}>
      {/* Top row: back chevron + edit */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
            <path d="M10 2L2 10l8 8" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[17px]" style={{ color: '#007AFF' }}>
            Postfächer
          </span>
        </div>
        <span className="text-[17px]" style={{ color: '#007AFF' }}>
          Bearbeiten
        </span>
      </div>
      {/* Large title */}
      <h1
        className="text-[34px] font-bold leading-tight"
        style={{ letterSpacing: '0.011em' }}
      >
        {mailboxName}
      </h1>
      {unreadCount > 0 && (
        <div className="text-[13px] mt-0.5" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
          {unreadCount} ungelesen
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Search bar — iOS pill
// -----------------------------------------------------------------------------

export function EmailSearchBar() {
  return (
    <div className="px-4 pb-2" style={{ background: '#FFFFFF' }}>
      <div
        className="flex items-center gap-2 rounded-[10px] px-2.5 py-2"
        style={{ background: 'rgba(118, 118, 128, 0.12)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="rgba(60, 60, 67, 0.6)" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="rgba(60, 60, 67, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[14px]" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
          Suchen
        </span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Filter chips — horizontal scroll row of pills
// -----------------------------------------------------------------------------

export function EmailFilterRow({
  filters,
}: {
  filters: NonNullable<EmailInboxProps['filters']>;
}) {
  return (
    <div
      className="px-4 pb-2 flex gap-2 overflow-x-auto"
      style={{ background: '#FFFFFF' }}
    >
      {filters.map((f, i) => (
        <button
          key={i}
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium"
          style={{
            background: f.active ? '#007AFF' : 'rgba(118, 118, 128, 0.12)',
            color: f.active ? '#FFFFFF' : '#000000',
          }}
        >
          {f.label}
          {typeof f.count === 'number' && (
            <span
              className="text-[11px] font-semibold"
              style={{ opacity: f.active ? 0.85 : 0.55 }}
            >
              {f.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Section divider — gray block heading between groups
// -----------------------------------------------------------------------------

export function EmailSectionDivider({ children }: { children: ReactNode }) {
  return (
    <div
      className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
      style={{
        background: 'rgba(247, 247, 247, 0.94)',
        color: 'rgba(60, 60, 67, 0.6)',
        borderTop: '0.5px solid #C6C6C8',
        borderBottom: '0.5px solid #C6C6C8',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Single email list item
// -----------------------------------------------------------------------------

export function EmailListItem({
  email,
  isLast,
}: {
  email: Email;
  isLast: boolean;
}) {
  const senderWeight = email.unread ? 600 : 400;
  const initials = email.sender
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarBg = email.avatarColor || '#8E8E93';

  return (
    <div
      className="relative flex items-start gap-2.5 px-4 py-2.5 active:bg-[#D1D1D6]"
      style={{
        background: '#FFFFFF',
        borderBottom: isLast ? 'none' : '0.5px solid #C6C6C8',
      }}
    >
      {/* Unread dot (left) */}
      <div className="w-2.5 shrink-0 flex justify-center pt-1.5">
        {email.unread && (
          <span
            aria-label="Unread"
            className="block h-2.5 w-2.5 rounded-full"
            style={{ background: '#007AFF' }}
          />
        )}
      </div>

      {/* Avatar (initials bubble) */}
      <div
        className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[13px] font-semibold mt-0.5"
        style={{ background: avatarBg, color: '#FFFFFF' }}
      >
        {initials}
      </div>

      {/* Body — sender + subject + preview */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {email.starred && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#FF9500" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M6 0.5l1.6 3.5 3.9 0.4-3 2.6 0.9 3.9L6 8.8l-3.4 2.1 0.9-3.9-3-2.6 3.9-0.4L6 0.5z" />
              </svg>
            )}
            <span
              className="text-[16px] truncate"
              style={{ fontWeight: senderWeight, letterSpacing: '-0.005em' }}
            >
              {email.sender}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[14px]" style={{ color: 'rgba(60, 60, 67, 0.6)' }}>
              {email.time}
            </span>
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
              <path d="M1 1l5 5.5L1 12" stroke="rgba(60, 60, 67, 0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span
            className="text-[15px] truncate flex-1"
            style={{ fontWeight: email.unread ? 500 : 400 }}
          >
            {email.subject}
            {email.threadCount && email.threadCount > 1 && (
              <span style={{ color: 'rgba(60, 60, 67, 0.6)', fontWeight: 400 }}>
                {' '}
                ({email.threadCount})
              </span>
            )}
          </span>
          {email.flagged && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#FF9500" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M2 1v12M2 1h9l-1.5 3 1.5 3H2" stroke="#FF9500" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        {email.preview && (
          <p
            className="text-[14px] leading-snug line-clamp-2"
            style={{ color: 'rgba(60, 60, 67, 0.7)', margin: 0 }}
          >
            {email.preview}
          </p>
        )}
      </div>
    </div>
  );
}
