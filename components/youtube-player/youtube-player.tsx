/**
 * YouTube Player — full YouTube watch-page UI as a composable component.
 *
 * Drops into iPhone-chassis (mobile YT) or MacBook-chassis (desktop YT).
 * Modular: video-frame is a slot (poster image, gradient fallback, or real
 * embed), action bar uses PressLike for the like button, recommendations
 * rail is optional via the `recommendations` prop.
 *
 * Layout variants:
 *   - 'embed' (default) — video + title + meta + action bar. Fits iPhone.
 *   - 'desktop' — full layout: video + title + actions + description +
 *     recommendations rail on the right. Fits MacBook hero size.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/youtube-player.json
 */

'use client';

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';
import { PressLike } from './press-like';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M Aufrufe`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K Aufrufe`;
  return `${n} Aufrufe`;
}

export interface YoutubeRecommendation {
  id: string | number;
  /** Thumbnail — image URL OR a ReactNode (e.g. AfGradientReel). */
  thumbnail: string | ReactNode;
  title: string;
  channel: string;
  views: number;
  postedAt: string;
  durationSec: number;
}

export interface YoutubePlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The video poster / first-frame content. ReactNode so it can be a gradient, image, or anything. */
  videoFrame: ReactNode;
  /** Video title — bold, h1-ish under the player. */
  title: string;
  /** Channel name. */
  channel: string;
  /** Channel avatar — image URL OR initials-fallback letter. */
  channelAvatar?: string;
  /** Subscriber count for the channel (display only). */
  subscribers?: string;
  /** Total view count (for the views formatter). */
  views: number;
  /** Posted-at line (e.g. "vor 2 Tagen", "vor 1 Jahr"). */
  postedAt: string;
  /** Total duration in seconds. */
  durationSec: number;
  /** Current playback position in seconds. Default 0. */
  currentTimeSec?: number;
  /** Initial playing state. Default false (paused, showing play button). */
  isPlaying?: boolean;
  /** Like count. */
  likes?: number;
  /** Initial liked state. */
  isLiked?: boolean;
  /** Layout variant. */
  variant?: 'embed' | 'desktop';
  /** Description text (rendered as expandable block in desktop variant). */
  description?: ReactNode;
  /** Recommendations for the right rail (desktop variant only). */
  recommendations?: YoutubeRecommendation[];
}

export function YoutubePlayer({
  videoFrame,
  title,
  channel,
  channelAvatar,
  subscribers,
  views,
  postedAt,
  durationSec,
  currentTimeSec = 0,
  isPlaying: initialPlaying = false,
  likes = 0,
  isLiked = false,
  variant = 'embed',
  description,
  recommendations,
  className,
  ...rest
}: YoutubePlayerProps) {
  const [playing, setPlaying] = useState(initialPlaying);
  const [time, setTime] = useState(currentTimeSec);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drive the scrubber when "playing" — simulate playback.
  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setTime((t) => {
        if (t >= durationSec) {
          setPlaying(false);
          return durationSec;
        }
        return t + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, durationSec]);

  const pct = Math.min(100, (time / durationSec) * 100);

  return (
    <div
      className={cn('flex w-full', className)}
      style={{
        fontFamily: 'Roboto, "Geist", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        flexDirection: variant === 'desktop' ? 'row' : 'column',
        gap: variant === 'desktop' ? 24 : 0,
        background: 'var(--af-paper)',
        color: 'var(--af-ink)',
        padding: variant === 'desktop' ? '24px' : '0',
      }}
      {...rest}
    >
      {/* MAIN COLUMN — player + meta + actions + description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Player frame — 16:9 aspect ratio, black background, poster, controls overlay */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            background: '#000',
            borderRadius: variant === 'desktop' ? 12 : 0,
            overflow: 'hidden',
          }}
        >
          {/* Video frame slot — z-0 */}
          <div style={{ position: 'absolute', inset: 0 }}>{videoFrame}</div>

          {/* Play-button overlay — visible when paused */}
          {!playing && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 68,
                  height: 48,
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: 12,
                  color: '#FFF',
                }}
              >
                <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </span>
            </button>
          )}

          {/* Bottom controls bar — z-20 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '0 12px 8px',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
              color: '#FFF',
              zIndex: 20,
              fontSize: 13,
            }}
          >
            {/* Scrubber — red progress bar, full-width track */}
            <div
              style={{
                width: '100%',
                height: 3,
                background: 'rgba(255,255,255,0.25)',
                marginBottom: 6,
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPct = (e.clientX - rect.left) / rect.width;
                setTime(durationSec * clickPct);
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: '#FF0000', // YouTube red — canonical
                  position: 'relative',
                }}
              >
                {/* Scrub thumb at the current position */}
                <div
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#FF0000',
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
                style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                {playing ? (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>
              <span style={{ fontFeatureSettings: '"tnum"' }}>
                {formatDuration(time)} / {formatDuration(durationSec)}
              </span>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                aria-label="Fullscreen"
                style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M7 14H5v5h5v-2H7v-3zM5 10h2V7h3V5H5v5zM17 17h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <h2
          style={{
            fontSize: variant === 'desktop' ? 20 : 16,
            fontWeight: 600,
            lineHeight: 1.3,
            margin: '12px 0 8px',
            color: 'var(--af-ink)',
          }}
        >
          {title}
        </h2>

        {/* CHANNEL + ACTION ROW */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Channel avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background:
                  typeof channelAvatar === 'string' && channelAvatar.startsWith('http')
                    ? `url(${channelAvatar}) center/cover no-repeat`
                    : 'linear-gradient(135deg, #60A5FA, #8B5CF6)',
                color: '#FFF',
                fontWeight: 600,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {(!channelAvatar || !channelAvatar.startsWith('http')) && (channelAvatar || channel[0])}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{channel}</div>
              {subscribers && (
                <div style={{ fontSize: 12, color: '#606060', lineHeight: 1.2 }}>{subscribers}</div>
              )}
            </div>
            <button
              type="button"
              style={{
                marginLeft: 8,
                padding: '8px 16px',
                background: '#0F0F0F',
                color: '#FFF',
                border: 0,
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Abonnieren
            </button>
          </div>

          {/* Action bar — like + share */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F2F2F2',
              padding: '6px 4px 6px 14px',
              borderRadius: 999,
            }}
          >
            <PressLike defaultLiked={isLiked} count={likes} size="compact" />
            <div style={{ width: 1, height: 20, background: '#D0D0D0' }} />
            <button
              type="button"
              aria-label="Share"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                padding: '4px 12px 4px 4px',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--af-ink)',
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx={18} cy={5} r={3}/>
                <circle cx={6} cy={12} r={3}/>
                <circle cx={18} cy={19} r={3}/>
                <line x1={8.59} y1={13.51} x2={15.42} y2={17.49}/>
                <line x1={15.41} y1={6.51} x2={8.59} y2={10.49}/>
              </svg>
              Teilen
            </button>
          </div>
        </div>

        {/* DESCRIPTION BLOCK */}
        {description && (
          <div
            style={{
              background: '#F2F2F2',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--af-ink)',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: '#606060' }}>
              {formatViews(views)} · {postedAt}
            </div>
            {description}
          </div>
        )}
      </div>

      {/* RECOMMENDATIONS RAIL — desktop only */}
      {variant === 'desktop' && recommendations && recommendations.length > 0 && (
        <aside
          style={{
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {recommendations.map((rec) => (
            <YoutubeRecommendationCard key={rec.id} rec={rec} />
          ))}
        </aside>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-component — recommendation card (exported for custom rail composition)
// -----------------------------------------------------------------------------
export function YoutubeRecommendationCard({ rec }: { rec: YoutubeRecommendation }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {/* Thumb — 16:9, fixed width, with duration badge */}
      <div
        style={{
          position: 'relative',
          width: 168,
          aspectRatio: '16 / 9',
          background: '#000',
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {typeof rec.thumbnail === 'string' ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `url(${rec.thumbnail}) center/cover no-repeat`,
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0 }}>{rec.thumbnail}</div>
        )}
        <div
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            padding: '1px 4px',
            background: 'rgba(0,0,0,0.8)',
            color: '#FFF',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 4,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {formatDuration(rec.durationSec)}
        </div>
      </div>

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--af-ink)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {rec.title}
        </div>
        <div style={{ fontSize: 12, color: '#606060', marginTop: 4, lineHeight: 1.3 }}>
          {rec.channel}
        </div>
        <div style={{ fontSize: 12, color: '#606060', lineHeight: 1.3 }}>
          {formatViews(rec.views)} · {rec.postedAt}
        </div>
      </div>
    </div>
  );
}

/**
 * AfYoutubeGradientPoster — fallback video poster when no real thumbnail is
 * available. AF-branded gradient with optional centered title overlay.
 * Mirrors AfGradientReel from reels-feed but for 16:9 instead of 9:16.
 */
export function AfYoutubeGradientPoster({
  title,
  hueShift = 0,
}: {
  title?: string;
  hueShift?: number;
}) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: `
          radial-gradient(ellipse 60% 80% at 20% 20%, hsla(${260 + hueShift}, 80%, 55%, 0.85) 0%, transparent 60%),
          radial-gradient(ellipse 80% 60% at 80% 80%, hsla(${210 + hueShift}, 80%, 55%, 0.75) 0%, transparent 60%),
          linear-gradient(135deg, hsl(${245 + hueShift}, 50%, 18%) 0%, hsl(${225 + hueShift}, 60%, 12%) 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: 'Roboto, "Geist", system-ui, sans-serif',
            color: '#FFF',
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            padding: '0 32px',
            textShadow: '0 4px 24px rgba(0,0,0,0.4)',
            maxWidth: '80%',
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
