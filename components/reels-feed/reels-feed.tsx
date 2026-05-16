/**
 * Reels Feed — vertical-video content surface for AF iPhone-chassis embeds.
 *
 * Models the Instagram Reels / TikTok / YouTube Shorts UI: full-bleed media
 * background, white iconography overlaid for legibility, right-rail action
 * stack, bottom info zone (creator + caption + music). Designed to slot into
 * iphone-chassis (immersive + wallpaper='none') so AF surfaces can show a
 * recognizable "this is content on someone's phone" moment.
 *
 * Visual contract (NOT AF-token-overridable — these are part of the medium):
 *   Background:   #000 (behind media)
 *   Text:         #FFFFFF with subtle drop-shadows for legibility on any media
 *   Heart-active: #FF3040 (Instagram red)
 *   Icons:        white, stroke 2, with 0 0 4px rgba(0,0,0,0.5) shadow
 *   Top/bottom legibility gradients: black-to-transparent fades
 *
 * Usage:
 *   <IPhoneChassis immersive wallpaper="none" size="hero">
 *     <ReelsFeed
 *       media={<video src="..." autoPlay loop muted />}
 *       creator={{ handle: "anfragenfluss", name: "Anfragenfluss", verified: true }}
 *       caption="Wie wir HOBA Solar in 60 Tagen auf 25 Anfragen/Woche gebracht haben."
 *       music={{ artist: "Original Sound", title: "anfragenfluss" }}
 *       stats={{ likes: 12400, comments: 287, shares: 94 }}
 *       liked={false}
 *     />
 *   </IPhoneChassis>
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/reels-feed.json
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ReelsCreator {
  /** Handle without @ prefix. */
  handle: string;
  /** Display name (optional). */
  name?: string;
  /** Verified badge (blue checkmark). */
  verified?: boolean;
  /** Avatar image URL OR initials fallback. */
  avatar?: string;
  /** Show a "Follow" / "Folgen" pill next to the handle. */
  showFollowButton?: boolean;
}

export interface ReelsMusic {
  /** Artist name. */
  artist: string;
  /** Song title. Combined with artist as "Artist · Title" in the marquee. */
  title: string;
  /** Small album-art thumbnail (URL). If omitted, uses a generic music-disc icon. */
  thumbnail?: string;
}

export interface ReelsStats {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
}

export interface ReelsFeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The actual reel content — typically a <video> element, but accepts any node (image, iframe, etc.). */
  media: ReactNode;
  /** Creator information shown in the bottom overlay. */
  creator: ReelsCreator;
  /** Caption text below the creator. */
  caption?: string;
  /** Music attribution row at the bottom. */
  music?: ReelsMusic;
  /** Action counts shown next to the right-rail icons. */
  stats?: ReelsStats;
  /** When true, heart icon fills red (post-liked state). */
  liked?: boolean;
  /** When true, save icon fills (post-saved state). */
  saved?: boolean;
  /** Hide the top progress-bar header (use when not in a feed context). */
  hideTopBar?: boolean;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export function ReelsFeed({
  media,
  creator,
  caption,
  music,
  stats,
  liked = false,
  saved = false,
  hideTopBar = false,
  className,
  ...rest
}: ReelsFeedProps) {
  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ background: '#000', color: '#FFFFFF' }}
      {...rest}
    >
      {/* Media layer — fills the whole screen behind all overlays */}
      <div className="absolute inset-0 z-0 [&>*]:h-full [&>*]:w-full [&>*]:object-cover">
        {media}
      </div>

      {/* Top legibility gradient + minimal header */}
      {!hideTopBar && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
            }}
          />
          <ReelsTopBar />
        </>
      )}

      {/* Bottom legibility gradient (always rendered so caption stays readable) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-72 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Right-rail action stack */}
      <ReelsRightRail
        creator={creator}
        stats={stats}
        liked={liked}
        saved={saved}
      />

      {/* Bottom-left info zone */}
      <ReelsBottomInfo
        creator={creator}
        caption={caption}
        music={music}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Top bar — Instagram-style "Reels" title centered, camera button right
// -----------------------------------------------------------------------------

function ReelsTopBar() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4"
      style={{ paddingTop: 52 }}
    >
      {/* Left placeholder for symmetry */}
      <span style={{ width: 24 }} />
      {/* Center "Reels" title */}
      <span
        className="text-[17px] font-semibold tracking-tight"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}
      >
        Reels
      </span>
      {/* Camera icon right */}
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Right-rail action stack — avatar + like + comment + share + save + more
// -----------------------------------------------------------------------------

function ReelsRightRail({
  creator,
  stats = {},
  liked,
  saved,
}: {
  creator: ReelsCreator;
  stats?: ReelsStats;
  liked: boolean;
  saved: boolean;
}) {
  return (
    <div
      className="absolute right-2 z-20 flex flex-col items-center gap-5"
      style={{ bottom: 90 }}
    >
      {/* Creator avatar with + overlay (tap to follow) */}
      <div className="relative">
        <div
          className="h-10 w-10 rounded-full overflow-hidden border-2"
          style={{
            background: creator.avatar
              ? `url(${creator.avatar}) center/cover`
              : 'linear-gradient(135deg, #60A5FA, #A78BFA)',
            borderColor: '#FFFFFF',
          }}
        >
          {!creator.avatar && (
            <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white">
              {creator.handle[0].toUpperCase()}
            </div>
          )}
        </div>
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full flex items-center justify-center"
          style={{ background: '#FF3040', border: '2px solid #000' }}
          aria-hidden="true"
        >
          <span className="text-white text-[14px] font-bold leading-none pb-0.5">+</span>
        </div>
      </div>

      {/* Like */}
      <RightRailAction
        icon={
          liked ? (
            <svg width="30" height="28" viewBox="0 0 24 22" fill="#FF3040" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
              <path d="M12 21s-7-5.5-9-9.5C1 7 4 3 8 4c2 0.5 3 2 4 3.5 1-1.5 2-3 4-3.5 4-1 7 3 5 7.5-2 4-9 9.5-9 9.5z" />
            </svg>
          ) : (
            <svg width="30" height="28" viewBox="0 0 24 22" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
              <path d="M12 21s-7-5.5-9-9.5C1 7 4 3 8 4c2 0.5 3 2 4 3.5 1-1.5 2-3 4-3.5 4-1 7 3 5 7.5-2 4-9 9.5-9 9.5z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          )
        }
        count={stats.likes}
      />

      {/* Comment */}
      <RightRailAction
        icon={
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
            <path d="M21 11.5a8.5 8.5 0 1 1-3.7-7l-1 5.5 5.5-1A8.5 8.5 0 0 1 21 11.5z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        }
        count={stats.comments}
      />

      {/* Share */}
      <RightRailAction
        icon={
          <svg width="30" height="28" viewBox="0 0 30 26" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
            <path d="M3 12.5L27 3l-7 22-6-9-11-3.5z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
            <path d="M14 16l13-13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
        count={stats.shares}
      />

      {/* Save (bookmark) */}
      <RightRailAction
        icon={
          saved ? (
            <svg width="22" height="28" viewBox="0 0 18 22" fill="#FFFFFF" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
              <path d="M3 1h12v20l-6-4.5L3 21V1z" />
            </svg>
          ) : (
            <svg width="22" height="28" viewBox="0 0 18 22" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
              <path d="M3 1h12v20l-6-4.5L3 21V1z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          )
        }
        count={stats.saves}
      />

      {/* More (3-dot) */}
      <svg width="22" height="6" viewBox="0 0 22 6" fill="#FFFFFF" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
        <circle cx="3" cy="3" r="2.5" />
        <circle cx="11" cy="3" r="2.5" />
        <circle cx="19" cy="3" r="2.5" />
      </svg>

      {/* Spinning music disc — links to the music attribution */}
      <div
        className="h-9 w-9 rounded-full overflow-hidden border-2"
        style={{
          background: 'linear-gradient(135deg, #1c1c1c, #444)',
          borderColor: '#FFFFFF',
          animation: 'reels-spin 6s linear infinite',
        }}
      >
        <div
          className="h-full w-full rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, transparent 32%, rgba(255,255,255,0.18) 33%, transparent 35%)' }}
        >
          <span className="block h-2 w-2 rounded-full" style={{ background: '#000' }} />
        </div>
      </div>
      <style>{`
        @keyframes reels-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function RightRailAction({ icon, count }: { icon: ReactNode; count?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button type="button" aria-label="Action" className="block">
        {icon}
      </button>
      {typeof count === 'number' && (
        <span
          className="text-[12px] font-semibold leading-none"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55)' }}
        >
          {formatCount(count)}
        </span>
      )}
    </div>
  );
}

/** Format counts the way Instagram / TikTok do — "1.2K", "12.4K", "1.2M". */
function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toFixed(m >= 10 ? 0 : 1)}M`;
  }
  if (n >= 1000) {
    const k = n / 1000;
    return `${k.toFixed(k >= 100 ? 0 : 1)}K`.replace('.0', '');
  }
  return String(n);
}

// -----------------------------------------------------------------------------
// Bottom-left info zone — creator + caption + music
// -----------------------------------------------------------------------------

function ReelsBottomInfo({
  creator,
  caption,
  music,
}: {
  creator: ReelsCreator;
  caption?: string;
  music?: ReelsMusic;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 pr-16">
      {/* Creator handle row */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[14px] font-semibold leading-tight"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55)' }}
        >
          @{creator.handle}
        </span>
        {creator.verified && (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M7 0.5l1.4 1.4 2-0.3 0.7 1.9 1.9 0.7-0.3 2L13.5 7l-1.4 1.4 0.3 2-1.9 0.7-0.7 1.9-2-0.3L7 13.5l-1.4-1.4-2 0.3-0.7-1.9-1.9-0.7 0.3-2L0.5 7l1.4-1.4-0.3-2 1.9-0.7 0.7-1.9 2 0.3z"
              fill="#0095F6"
            />
            <path d="M4 7l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
        {creator.showFollowButton && (
          <button
            type="button"
            className="ml-1 px-3 py-0.5 rounded-md text-[12px] font-semibold border"
            style={{ borderColor: 'rgba(255,255,255,0.85)', color: '#FFFFFF', background: 'rgba(0,0,0,0.18)' }}
          >
            Folgen
          </button>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p
          className="text-[13.5px] leading-snug mb-3 max-w-[90%]"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55)' }}
        >
          {caption}
        </p>
      )}

      {/* Music attribution row */}
      {music && (
        <div className="flex items-center gap-2 max-w-[80%]">
          {/* Music note icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#FFFFFF" aria-hidden="true" style={{ flexShrink: 0, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
            <path d="M5 1.5v6.8a2 2 0 1 1-1.3-1.9V3l8-1.5v6a2 2 0 1 1-1.3-1.9V1.5l-5.4 1z" />
          </svg>
          {/* Scrolling marquee — single-line truncated */}
          <span
            className="text-[12px] truncate"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.55)',
              flex: 1,
              minWidth: 0,
            }}
          >
            {music.artist} · {music.title}
          </span>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// AfGradientReel — a fallback "media" component for when you don't have a real
// video. Shows an animated AF-branded gradient so the chassis looks alive.
// -----------------------------------------------------------------------------

export function AfGradientReel({ caption }: { caption?: string }) {
  return (
    <div
      className="h-full w-full relative"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 30% 25%, rgba(140, 92, 246, 0.85) 0%, rgba(140, 92, 246, 0) 60%),
          radial-gradient(ellipse 60% 50% at 75% 70%, rgba(96, 165, 250, 0.85) 0%, rgba(96, 165, 250, 0) 60%),
          linear-gradient(135deg, #1c1c4a 0%, #131a3a 50%, #0e1830 100%)
        `,
      }}
    >
      {caption && (
        <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
          <span
            className="text-white text-[22px] font-semibold leading-tight"
            style={{
              fontFamily: 'var(--af-font-sans)',
              letterSpacing: '-0.014em',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              maxWidth: '90%',
            }}
          >
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
