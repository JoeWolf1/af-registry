/**
 * Instagram Profile — content surface for AF iPhone-chassis embeds.
 *
 * Models the Instagram profile page so the medium is instantly recognizable
 * on an iPhone chassis. Slots into iphone-chassis (immersive + wallpaper='none')
 * for AF brand-presence demonstrations on Experience-Page surfaces.
 *
 * Visual contract (Instagram conventions — NOT AF-overridable):
 *   Background:        #FFFFFF
 *   Header text:       #000000
 *   Muted text:        rgba(0, 0, 0, 0.55)
 *   Verified blue:     #0095F6
 *   Follow button:     #0095F6 bg, white text
 *   Action button bg:  #EFEFEF
 *   Story ring:        gradient pink → orange → yellow
 *   Tab bar divider:   #DBDBDB
 *
 * Usage:
 *   <IPhoneChassis immersive wallpaper="none">
 *     <InstagramProfile
 *       handle="anfragenfluss"
 *       name="Anfragenfluss"
 *       verified
 *       bio="Wir bauen Lead-Pipelines für KMUs · Kostenlose Analyse"
 *       website="anfragenfluss.cloud"
 *       stats={{ posts: 184, followers: 12400, following: 247 }}
 *       highlights={[...]}
 *       posts={[...]}
 *     />
 *   </IPhoneChassis>
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/instagram-profile.json
 */

'use client';

import { type ReactNode, type HTMLAttributes } from 'react';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
}

export interface StoryHighlight {
  /** Label below the circle (e.g. "Fallstudien"). */
  label: string;
  /** Cover image URL OR a colored gradient via the `gradient` prop instead. */
  cover?: string;
  /** Background gradient when no image — pulled from AF palette. */
  gradient?: string;
}

export interface ProfilePost {
  /** Image URL. If omitted, uses `gradient` for a placeholder tile. */
  src?: string;
  gradient?: string;
  /** Optional Reel indicator (small play triangle in corner). */
  isReel?: boolean;
  /** Optional carousel indicator (small layered-square icon in corner). */
  isCarousel?: boolean;
  /** Alt text. */
  alt?: string;
}

export interface InstagramProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Handle without @ prefix. */
  handle: string;
  /** Display name shown bold in the bio. */
  name?: string;
  /** Verified blue check next to the handle. */
  verified?: boolean;
  /** Bio body text (multi-line allowed; rendered with whitespace preserved). */
  bio?: string;
  /** Website link displayed in Instagram blue. */
  website?: string;
  /** Profile category label (e.g. "Marketing- und Werbeagentur"). */
  category?: string;
  /** Avatar URL OR initials fallback. */
  avatar?: string;
  /** Engagement counts. */
  stats: ProfileStats;
  /** Story highlights row. Empty array hides the row. */
  highlights?: StoryHighlight[];
  /** 3-column grid of posts. */
  posts: ProfilePost[];
  /** Which tab is active. */
  activeTab?: 'posts' | 'reels' | 'tagged';
  /** When true, shows "Folgen" + "Nachricht" buttons (viewing other profile).
   *  When false, shows "Profil bearbeiten" + "Profil teilen" (own profile). */
  showFollowButtons?: boolean;
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export function InstagramProfile({
  handle,
  name,
  verified = false,
  bio,
  website,
  category,
  avatar,
  stats,
  highlights = [],
  posts,
  activeTab = 'posts',
  showFollowButtons = false,
  className,
  ...rest
}: InstagramProfileProps) {
  const initials = handle[0].toUpperCase();

  return (
    <div
      className={cn('flex h-full w-full flex-col overflow-y-auto font-[-apple-system,BlinkMacSystemFont,system-ui,sans-serif]', className)}
      style={{ background: '#FFFFFF', color: '#000000' }}
      {...rest}
    >
      {/* Top app bar */}
      <ProfileTopBar handle={handle} verified={verified} />

      {/* Profile head: avatar + stat counts */}
      <div className="flex items-center gap-6 px-4 pt-3 pb-3">
        <div
          className="h-[86px] w-[86px] shrink-0 rounded-full flex items-center justify-center text-[28px] font-semibold border-2"
          style={{
            background: avatar ? `url(${avatar}) center/cover` : 'linear-gradient(135deg, #60A5FA, #A78BFA)',
            color: '#FFFFFF',
            borderColor: '#FFFFFF',
            boxShadow: '0 0 0 1.5px #DBDBDB',
          }}
        >
          {!avatar && initials}
        </div>
        <div className="flex-1 flex justify-around">
          <ProfileStat value={stats.posts} label="Beiträge" />
          <ProfileStat value={stats.followers} label="Follower" />
          <ProfileStat value={stats.following} label="Folge ich" />
        </div>
      </div>

      {/* Name + bio block */}
      <div className="px-4 pb-3">
        {name && (
          <div className="text-[14px] font-semibold leading-snug" style={{ letterSpacing: '-0.005em' }}>
            {name}
          </div>
        )}
        {category && (
          <div className="text-[13px] mt-0.5" style={{ color: 'rgba(0, 0, 0, 0.55)' }}>
            {category}
          </div>
        )}
        {bio && (
          <p
            className="text-[14px] leading-snug mt-0.5 whitespace-pre-line"
            style={{ color: '#000000' }}
          >
            {bio}
          </p>
        )}
        {website && (
          <a
            href={`https://${website}`}
            className="text-[14px] font-medium block mt-0.5"
            style={{ color: '#00376B' }}
          >
            {website}
          </a>
        )}
      </div>

      {/* Action buttons row */}
      <div className="flex gap-1.5 px-4 pb-4">
        {showFollowButtons ? (
          <>
            <ProfileActionButton primary>Folgen</ProfileActionButton>
            <ProfileActionButton>Nachricht</ProfileActionButton>
            <ProfileActionButton>E-Mail</ProfileActionButton>
            <ProfileIconButton ariaLabel="Mehr Optionen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#000000" aria-hidden="true">
                <path d="M3 4l5 5 5-5" stroke="#000000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ProfileIconButton>
          </>
        ) : (
          <>
            <ProfileActionButton>Profil bearbeiten</ProfileActionButton>
            <ProfileActionButton>Profil teilen</ProfileActionButton>
            <ProfileIconButton ariaLabel="Personen entdecken">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="6" r="3" stroke="#000000" strokeWidth="1.5" />
                <path d="M3 16c0-3 2.5-5 6-5s6 2 6 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M15 4v4M13 6h4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </ProfileIconButton>
          </>
        )}
      </div>

      {/* Story highlights row */}
      {highlights.length > 0 && (
        <div className="flex gap-3.5 px-4 pb-4 overflow-x-auto">
          {highlights.map((h, i) => (
            <ProfileStoryHighlight key={i} highlight={h} />
          ))}
        </div>
      )}

      {/* Tab bar */}
      <ProfileTabBar activeTab={activeTab} />

      {/* Post grid */}
      <ProfilePostGrid posts={posts} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function ProfileTopBar({ handle, verified }: { handle: string; verified: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-4"
      style={{
        paddingTop: 52,
        paddingBottom: 10,
        background: '#FFFFFF',
        borderBottom: '0.5px solid #DBDBDB',
      }}
    >
      {/* Left: lock icon for private (we'll skip) + handle + chevron */}
      <div className="flex items-center gap-1">
        <span className="text-[16px] font-semibold">{handle}</span>
        {verified && (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M7 0.5l1.4 1.4 2-0.3 0.7 1.9 1.9 0.7-0.3 2L13.5 7l-1.4 1.4 0.3 2-1.9 0.7-0.7 1.9-2-0.3L7 13.5l-1.4-1.4-2 0.3-0.7-1.9-1.9-0.7 0.3-2L0.5 7l1.4-1.4-0.3-2 1.9-0.7 0.7-1.9 2 0.3z"
              fill="#0095F6"
            />
            <path d="M4 7l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="ml-0.5">
          <path d="M3 4.5l3 3 3-3" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Right: new post + menu */}
      <div className="flex items-center gap-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="16" height="16" rx="4" stroke="#000000" strokeWidth="1.5" />
          <path d="M11 8v6M8 11h6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="#000000" aria-hidden="true">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[17px] font-semibold leading-tight">{formatCount(value)}</span>
      <span className="text-[13px] mt-0" style={{ color: '#000000' }}>
        {label}
      </span>
    </div>
  );
}

function ProfileActionButton({
  children,
  primary,
}: {
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex-1 rounded-lg py-1.5 text-[14px] font-semibold"
      style={{
        background: primary ? '#0095F6' : '#EFEFEF',
        color: primary ? '#FFFFFF' : '#000000',
      }}
    >
      {children}
    </button>
  );
}

function ProfileIconButton({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="rounded-lg px-2.5 flex items-center justify-center"
      style={{ background: '#EFEFEF' }}
    >
      {children}
    </button>
  );
}

function ProfileStoryHighlight({ highlight }: { highlight: StoryHighlight }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div
        className="h-[64px] w-[64px] rounded-full p-[2px]"
        style={{
          background: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: highlight.cover
              ? `url(${highlight.cover}) center/cover`
              : highlight.gradient ?? 'linear-gradient(135deg, #60A5FA, #A78BFA)',
            border: '2px solid #FFFFFF',
          }}
        />
      </div>
      <span className="text-[12px] truncate max-w-[68px] text-center">{highlight.label}</span>
    </div>
  );
}

function ProfileTabBar({ activeTab }: { activeTab: 'posts' | 'reels' | 'tagged' }) {
  return (
    <div className="flex border-t" style={{ borderColor: '#DBDBDB' }}>
      <ProfileTab active={activeTab === 'posts'}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 8h18M2 14h18M8 2v18M14 2v18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </ProfileTab>
      <ProfileTab active={activeTab === 'reels'}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 7v8l6-4-6-4z" fill="currentColor" />
        </svg>
      </ProfileTab>
      <ProfileTab active={activeTab === 'tagged'}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M11 2l9 9-9 9-9-9 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </ProfileTab>
    </div>
  );
}

function ProfileTab({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center py-2.5"
      style={{
        color: active ? '#000000' : 'rgba(0, 0, 0, 0.35)',
        borderTop: active ? '1.5px solid #000000' : '1.5px solid transparent',
        marginTop: -0.5,
      }}
    >
      {children}
    </button>
  );
}

function ProfilePostGrid({ posts }: { posts: ProfilePost[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] mt-0">
      {posts.map((post, i) => (
        <div
          key={i}
          className="relative aspect-square"
          style={{
            background: post.src
              ? `url(${post.src}) center/cover`
              : post.gradient ?? 'linear-gradient(135deg, #131a3a 0%, #2a1f5c 100%)',
          }}
        >
          {post.isReel && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="#FFFFFF"
              aria-hidden="true"
              className="absolute top-1.5 right-1.5"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
            >
              <path d="M3 1.5l9 5.5-9 5.5v-11z" />
            </svg>
          )}
          {post.isCarousel && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="absolute top-1.5 right-1.5"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
            >
              <rect x="3" y="3" width="9" height="9" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="1" y="1" width="9" height="9" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toFixed(m >= 10 ? 0 : 1)}M`.replace('.0', '');
  }
  if (n >= 1000) {
    const k = n / 1000;
    return `${k.toFixed(k >= 100 ? 0 : 1)}K`.replace('.0', '');
  }
  return String(n);
}
