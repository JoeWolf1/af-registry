/**
 * Press Like — Instagram-style heart bounce when liked. Standalone primitive
 * (used inside YoutubePlayer's like button, AfHeartButton, anywhere a "tap
 * to like" affordance lives).
 *
 * State machine:
 *   resting → (click) → bursting (200ms scale-up + color flip) → liked
 *   liked → (click) → resting
 *
 * The bounce is what makes the interaction feel REAL. Without it the like
 * just toggles state silently and the user doesn't get the dopamine hit.
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/press-like.json
 *
 * Usage:
 *   <PressLike count={1247} />
 *   <PressLike defaultLiked countFormat="short" onToggle={(liked) => track(liked)} />
 */

'use client';

import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { useReducedMotion } from './use-reduced-motion';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatCount(n: number, fmt: 'short' | 'full' = 'short'): string {
  if (fmt === 'full') return n.toLocaleString('de-DE');
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

export interface PressLikeProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Initial liked state. Uncontrolled by default. */
  defaultLiked?: boolean;
  /** Controlled liked state. Pair with `onToggle`. */
  liked?: boolean;
  /** Fired when liked state changes (controlled OR uncontrolled). */
  onToggle?: (liked: boolean) => void;
  /** Like count. When provided, displays alongside the heart. */
  count?: number;
  /** Count display format. Default 'short' (1.2K / 12.4K / 1.2M). */
  countFormat?: 'short' | 'full';
  /** Size variant. Default 'default'. */
  size?: 'compact' | 'default' | 'large';
  /** Color when liked. Default Instagram-canon red (#ED4956). */
  likedColor?: string;
  /** Color when resting. Default 'currentColor' (inherits text color). */
  restingColor?: string;
}

export function PressLike({
  defaultLiked = false,
  liked: controlledLiked,
  onToggle,
  count,
  countFormat = 'short',
  size = 'default',
  likedColor = '#ED4956',
  restingColor = 'currentColor',
  className,
  onClick,
  ...rest
}: PressLikeProps) {
  const reducedMotion = useReducedMotion();
  const [uncontrolledLiked, setUncontrolledLiked] = useState(defaultLiked);
  const liked = controlledLiked ?? uncontrolledLiked;

  const [bursting, setBursting] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup pending burst timer on unmount
  useEffect(() => () => {
    if (burstTimer.current) clearTimeout(burstTimer.current);
  }, []);

  const sizes = {
    compact: { btn: 28, icon: 18, gap: 6, font: 12 },
    default: { btn: 40, icon: 26, gap: 8, font: 14 },
    large: { btn: 56, icon: 36, gap: 10, font: 16 },
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const next = !liked;
    if (controlledLiked === undefined) setUncontrolledLiked(next);
    onToggle?.(next);

    // Burst animation fires on EVERY click (like → unlike OR unlike → like).
    // The bounce confirms the press registered, regardless of final state.
    // Reduced-motion users skip the scale-burst entirely — the color flip
    // (red ↔ inherit) is the state confirmation. WCAG 2.2 SC 2.3.3.
    // AF Werkschau lab report 2026-05-16 § A.5.
    if (!reducedMotion) {
      setBursting(true);
      if (burstTimer.current) clearTimeout(burstTimer.current);
      burstTimer.current = setTimeout(() => setBursting(false), 320);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? 'Like entfernen' : 'Liken'}
      onClick={handleClick}
      className={cn('inline-flex items-center', className)}
      style={{
        gap: sizes.gap,
        padding: 0,
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        color: liked ? likedColor : restingColor,
        fontFamily: 'inherit',
        fontSize: sizes.font,
        fontWeight: 500,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: sizes.btn,
          height: sizes.btn,
          // Burst: scale up + slight rotate, then settle. Spring easing for the
          // settle so the heart feels alive. Tap also flashes when un-liking.
          transform: bursting ? 'scale(1.32) rotate(-8deg)' : 'scale(1) rotate(0deg)',
          transition: bursting
            ? 'transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          // Promote GPU layer only during the 320ms burst window — outside the
          // burst, the heart is static, so we release the compositor layer.
          // Same reasoning as the other AF animation primitives.
          // AF Werkschau lab report 2026-05-16 § A.6.
          willChange: bursting ? 'transform' : 'auto',
        }}
      >
        <HeartSvg
          size={sizes.icon}
          filled={liked}
          color={liked ? likedColor : 'currentColor'}
        />
      </span>
      {typeof count === 'number' && (
        <span
          style={{
            fontFeatureSettings: '"tnum"',
            color: liked ? likedColor : 'currentColor',
            transition: 'color 220ms ease',
          }}
        >
          {formatCount(liked && controlledLiked === undefined ? count + 1 : count, countFormat)}
        </span>
      )}
    </button>
  );
}

function HeartSvg({ size, filled, color }: { size: number; filled: boolean; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
