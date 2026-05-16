/**
 * Three-Phase iPhone Hero — narrative-arc orchestrator for AF Experience-Page surfaces.
 *
 * Default narrative arc per af-brand-doctrine § 2:
 *   Phase 1 — Documentary evidence (real customer artifact, active state)
 *   Phase 2 — Pivot question (fourth-wall splash, e.g. "Wann bist DU dran?")
 *   Phase 3 — Future-self projection (visitor's own outcome in same medium)
 *
 * MUST use 3 DIFFERENT mediums across phases — not 3 screens of the same app.
 * All three phases MUST be REAL artifacts (placeholder content fails the bar
 * per af-brand-doctrine § 3. Real data, never placeholder).
 *
 * Lift the chassis from zusammenarbeit.anfragenfluss.de FIRST — don't
 * re-implement (Damian-canon "1:1 nachbauen / klauen" authority).
 *
 * Source of truth: af-brand-doctrine § 2. Three-phase iPhone hero
 *
 * Install:
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/iphone-chassis.json
 *   npx shadcn add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/three-phase-iphone-hero.json
 *
 * Layout:
 *   2-column grid on desktop. LEFT: scrollable per-phase commentary slots
 *   (3 stacked, ~80vh each, providing scroll distance). RIGHT: sticky iPhone
 *   at top-[10vh], h-fit (sizes to iPhone naturally, no overflow).
 *
 *   As the visitor scrolls, IntersectionObserver detects which commentary
 *   slot is in viewport center and swaps the iPhone screen content to match.
 *
 *   Mobile (lg-): all 3 phases stack vertically as static iPhones.
 *
 * Usage:
 *   <ThreePhaseIphoneHero
 *     phase1={<WhatsAppChatMessages messages={...} />}
 *     phase2="Wann bist DU dran?"
 *     phase3={<ReelsFeed customer="..." />}
 *     commentary={[
 *       <p>Phase 1 commentary text — Hans Bauer's last 5 leads</p>,
 *       null, // splash speaks for itself
 *       <p>Phase 3 commentary text — this is your inbox in 6 months</p>,
 *     ]}
 *     caption="Hans Bauer — HOBA Energietechnik"
 *   />
 *
 * IMPORTANT — preflight-device-mock skill MUST fire before real-surface use.
 */

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
// IMPORTANT: use the @/ alias path — when shadcn CLI installs this component,
// both files land as flat siblings in <project>/components/af/, so a relative
// '../iphone-chassis/iphone-chassis' path breaks. The @/ alias works in any
// consumer project that has the standard shadcn alias configured.
import { IPhoneChassis } from '@/components/af/iphone-chassis';

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface ThreePhaseIphoneHeroProps {
  /** Phase 1 content — documentary evidence (real artifact in active state). */
  phase1: ReactNode;
  /**
   * Phase 2 content — the fourth-wall pivot moment.
   * Pass a string for the canonical splash-text treatment; pass a ReactNode for custom.
   * Damian's canonical phrasing on kundenstimmen: "Wann bist DU dran?"
   */
  phase2: string | ReactNode;
  /** Phase 3 content — future-self projection (visitor's own outcome in same medium). */
  phase3: ReactNode;
  /**
   * Optional per-phase commentary rendered in the scrollable left column.
   * Tuple of [phase1Commentary, phase2Commentary, phase3Commentary].
   * Pass `null` for any phase to leave its slot empty (still contributes scroll distance).
   */
  commentary?: [ReactNode, ReactNode, ReactNode];
  /** Caption below the iPhone — typically customer attribution. */
  caption?: ReactNode;
  /** Optional extra classes on the wrapper. */
  className?: string;
}

type Phase = 1 | 2 | 3;

export function ThreePhaseIphoneHero({
  phase1,
  phase2,
  phase3,
  commentary,
  caption,
  className,
}: ThreePhaseIphoneHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<Phase>(1);

  // ---------------------------------------------------------------------------
  // Scroll-pivot: IntersectionObserver-based phase progression.
  //
  // Why IntersectionObserver + sentinels (not GSAP ScrollTrigger):
  // - Zero runtime dependency (GSAP is +27KB)
  // - Sufficient precision for 3-phase progression (we're not doing scrub/parallax)
  // - prefers-reduced-motion respected by skipping the observer entirely
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    // Respect prefers-reduced-motion: show phase 1 statically, no progression
    if (typeof window !== 'undefined') {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        setActivePhase(1);
        return;
      }
    }

    const sentinels = root.querySelectorAll<HTMLElement>('[data-phase-sentinel]');
    if (sentinels.length !== 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number(e.target.getAttribute('data-phase-sentinel')) as Phase);
        if (visible.length > 0) {
          // Last visible sentinel wins — we want the deepest-scrolled phase
          setActivePhase(visible[visible.length - 1]);
        }
      },
      {
        // Fire when sentinel is roughly in the viewport center
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      },
    );

    sentinels.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const phaseContent: Record<Phase, ReactNode> = {
    1: phase1,
    2:
      typeof phase2 === 'string' ? (
        <PivotSplash text={phase2} />
      ) : (
        phase2
      ),
    3: phase3,
  };

  const phaseLabels: Record<Phase, string> = {
    1: 'Heute',
    2: 'Der Moment',
    3: 'Morgen',
  };

  const phaseCommentary: [ReactNode, ReactNode, ReactNode] = commentary ?? [
    null,
    null,
    null,
  ];

  return (
    <div
      ref={sectionRef}
      className={cn(
        'relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16',
        className,
      )}
      aria-label="Three-phase narrative — documentary, pivot, future-self"
    >
      {/* ---- LEFT COLUMN: scrollable per-phase commentary slots ---- */}
      <div className="hidden lg:flex lg:flex-col">
        {([1, 2, 3] as const).map((p, idx) => (
          <div
            key={p}
            data-phase-sentinel={p}
            className="min-h-[80vh] flex flex-col justify-center py-12"
          >
            <span
              className={cn(
                'text-xs font-semibold tracking-wider uppercase transition-colors duration-300',
                activePhase === p
                  ? 'text-[color:var(--af-pulse,#60A5FA)]'
                  : 'text-[color:var(--af-ink-muted,#14233E)] opacity-50',
              )}
            >
              Phase {p} — {phaseLabels[p]}
            </span>
            <div
              className={cn(
                'mt-4 text-[color:var(--af-ink,#010E26)] transition-opacity duration-300',
                activePhase === p ? 'opacity-100' : 'opacity-40',
              )}
            >
              {phaseCommentary[idx] ?? (
                <p className="text-base text-[color:var(--af-ink-muted,#14233E)] italic">
                  ({phaseLabels[p]} — Kommentar hier optional)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---- RIGHT COLUMN: sticky iPhone ---- */}
      <div className="hidden lg:block">
        <div className="sticky top-[10vh] flex flex-col items-center py-[10vh]">
          <IPhoneChassis size="default" caption={caption}>
            <PhaseScreen activePhase={activePhase}>
              {phaseContent[activePhase]}
            </PhaseScreen>
          </IPhoneChassis>
        </div>
      </div>

      {/* ---- MOBILE FALLBACK: all 3 phases stacked vertically ---- */}
      <div className="lg:hidden flex flex-col gap-12" aria-hidden="false">
        {([1, 2, 3] as const).map((p, idx) => (
          <div key={p} className="flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-wider uppercase text-[color:var(--af-pulse,#60A5FA)]">
                Phase {p} — {phaseLabels[p]}
              </span>
              {phaseCommentary[idx] && (
                <div className="mt-3 px-4 text-sm text-[color:var(--af-ink,#010E26)]">
                  {phaseCommentary[idx]}
                </div>
              )}
            </div>
            <IPhoneChassis size="compact" caption={p === 3 ? caption : undefined}>
              {phaseContent[p]}
            </IPhoneChassis>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PhaseScreen — wraps phase content with a fade transition between phases.
// ---------------------------------------------------------------------------
function PhaseScreen({
  activePhase,
  children,
}: {
  activePhase: Phase;
  children: ReactNode;
}) {
  return (
    <div
      key={activePhase}
      className={cn(
        'h-full w-full',
        // Fade-in on mount via CSS keyframe (no JS animation lib needed)
        'animate-[af-fade-in_320ms_cubic-bezier(0.16,1,0.3,1)]',
        'motion-reduce:animate-none',
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PivotSplash — Damian's canonical fourth-wall splash treatment for Phase 2.
// ---------------------------------------------------------------------------
function PivotSplash({ text }: { text: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center',
        'bg-[color:var(--af-ink,#010E26)] text-[color:var(--af-paper,#FFFFFF)]',
        'p-8 text-center',
      )}
    >
      <p
        className={cn(
          'text-3xl font-bold leading-tight',
          'text-[color:var(--af-paper,#FFFFFF)]',
        )}
      >
        {text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSS keyframe for fade-in — injected once into the document head.
// Remove this block if your project already has an af-fade-in keyframe.
// ---------------------------------------------------------------------------
if (typeof document !== 'undefined' && !document.querySelector('#af-three-phase-styles')) {
  const style = document.createElement('style');
  style.id = 'af-three-phase-styles';
  style.textContent = `
    @keyframes af-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
