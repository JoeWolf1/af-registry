/**
 * AFVQ Card (Unified) — AF testimonial card pattern.
 *
 * One unified frame containing left-aligned testimonial text + right-aligned
 * video, joined by an AFVQ pulse-blue underglow that ties both halves into
 * a single designed moment.
 *
 * Source of truth: ~/.claude/skills/af-design-catalog/anchors/experience-page.md
 *                  + af-brand-doctrine § 6. AFVQ-card-unified
 *
 * Depends on: af-tokens (AF CSS variables — install via shadcn first)
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *
 * Then install this component:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/afvq-card-unified.json
 *
 * Usage:
 *   <AfvqCardUnified
 *     customerName="Hans Bauer"
 *     customerCompany="HOBA Energietechnik GmbH"
 *     quote="Anfragenfluss hat unsere Lead-Pipeline transformiert."
 *     videoSrc="/videos/hoba-testimonial.mp4"
 *     posterSrc="/videos/hoba-testimonial-poster.jpg"
 *     variant="left-text"
 *   />
 *
 * Anti-patterns (don't):
 *   - Re-introduce 3-pill badges (Sofort/Proaktiv/Langfristig) — Damian rejected as "zu schwammig"
 *   - Auto-play with sound on page load (click-to-play with sound is canon)
 *   - Placeholder content — every card MUST trace to real customer / real outcome
 *   - Same variant on every card in a row (alternate via parent layout for visual rhythm)
 */

'use client';

import { useRef, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Minimal cn() — inline so this component has no external utility dependency.
// If your project already uses shadcn's lib/utils, replace with that import:
//   import { cn } from "@/lib/utils";
// ---------------------------------------------------------------------------
function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface AfvqCardUnifiedProps {
  /** Customer's name shown in the attribution footer. */
  customerName: string;
  /** Customer's company shown beneath the name. */
  customerCompany: string;
  /** The testimonial quote. */
  quote: string;
  /** Video source URL. */
  videoSrc: string;
  /** Optional poster image shown before play. */
  posterSrc?: string;
  /**
   * Layout variant — `left-text` (default) puts text on the left and video on
   * the right; `right-text` flips for alternating row rhythm. Damian's
   * "abwechselnd" directive — alternate per row, not per card.
   */
  variant?: 'left-text' | 'right-text';
  /** Optional extra classes to merge onto the root article. */
  className?: string;
  /** Optional caption / sub-attribution slot. */
  caption?: ReactNode;
}

export function AfvqCardUnified({
  customerName,
  customerCompany,
  quote,
  videoSrc,
  posterSrc,
  variant = 'left-text',
  className,
  caption,
}: AfvqCardUnifiedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy can reject; surface as un-played so user can retry.
        setIsPlaying(false);
      });
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article
      className={cn(
        // Base — single unified frame
        'relative isolate flex flex-col md:flex-row items-stretch gap-0 overflow-hidden rounded-3xl',
        'bg-[color:var(--af-paper,#FFFFFF)]',
        'border border-[color:var(--af-border-subtle,rgba(1,14,38,0.10))]',

        // AFVQ underglow stack — three layers tied together
        'shadow-[0_0_0_1px_var(--af-pulse-glow-06,rgba(96,165,250,0.06)),0_8px_24px_-4px_var(--af-pulse-glow-18,rgba(96,165,250,0.18)),0_4px_12px_-2px_var(--af-ink-glow-08,rgba(1,14,38,0.08))]',
        'transition-[box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:shadow-[0_0_0_1px_var(--af-pulse-glow-12,rgba(96,165,250,0.12)),0_12px_32px_-4px_var(--af-pulse-glow-28,rgba(96,165,250,0.28)),0_6px_16px_-2px_var(--af-ink-glow-10,rgba(1,14,38,0.10))]',
        'motion-reduce:transition-none',

        // Variant — flips text/video order on md+ for alternating row rhythm
        variant === 'right-text' && 'md:flex-row-reverse',

        className,
      )}
      role="article"
      aria-label={`Kundenstimme von ${customerName}, ${customerCompany}`}
    >
      {/* ---- Text half ---- */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8 lg:p-10">
        <blockquote className="text-lg md:text-xl leading-relaxed font-medium text-[color:var(--af-ink,#010E26)]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <footer className="mt-6 flex flex-col gap-1">
          <cite className="not-italic text-base font-semibold text-[color:var(--af-ink,#010E26)]">
            {customerName}
          </cite>
          <span className="text-sm text-[color:var(--af-ink-muted,#14233E)]">
            {customerCompany}
          </span>
          {caption && (
            <div className="mt-2 text-sm text-[color:var(--af-ink-muted,#14233E)]">
              {caption}
            </div>
          )}
        </footer>
      </div>

      {/* ---- Seam separator — "zusammenhängend, kein harter Übergang" ---- */}
      <div
        aria-hidden="true"
        className="hidden md:block w-px self-stretch bg-[color:var(--af-border-subtle,rgba(1,14,38,0.10))]"
      />

      {/* ---- Video half ---- */}
      <div className="relative flex flex-1 items-stretch min-h-[280px] md:min-h-[360px] bg-[color:var(--af-ink,#010E26)]">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Video pausieren' : 'Video abspielen'}
          aria-pressed={isPlaying}
          className={cn(
            'group relative flex-1 cursor-pointer overflow-hidden',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--af-pulse,#60A5FA)] focus-visible:ring-offset-2',
          )}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />

          {/* Play affordance — visible until first play, then hidden */}
          {!isPlaying && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent"
            >
              <span
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full',
                  'bg-[color:var(--af-paper,#FFFFFF)] text-[color:var(--af-ink,#010E26)]',
                  'shadow-lg transition-transform duration-200',
                  'group-hover:scale-110 motion-reduce:group-hover:scale-100',
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
