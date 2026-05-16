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
 * Usage:
 *   <ThreePhaseIphoneHero
 *     phase1={<WhatsAppChatMessages messages={...} />}    // documentary
 *     phase2="Wann bist DU dran?"                          // pivot splash
 *     phase3={<ReelsFeed customer="..." />}                // future-self
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
  /** Caption below the iPhone — typically customer attribution. */
  caption?: ReactNode;
  /** iPhone chassis size — see IPhoneChassis. */
  size?: 'compact' | 'default' | 'hero';
  /** Pin the iPhone during scroll-pivot — recommended for hero placement. */
  pinned?: boolean;
  /** Optional extra classes on the wrapper. */
  className?: string;
}

type Phase = 1 | 2 | 3;

export function ThreePhaseIphoneHero({
  phase1,
  phase2,
  phase3,
  caption,
  size = 'hero',
  pinned = true,
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
  //
  // Upgrade path: if the surface needs scrub-tied animations between phases
  // (e.g. continuous transform interpolation), swap to GSAP ScrollTrigger.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    // Respect prefers-reduced-motion: show all phases as static, no progression
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
        rootMargin: '-40% 0px -40% 0px', // fires when sentinel is near viewport center
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

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-16',
        className,
      )}
      aria-label="Three-phase narrative — documentary, pivot, future-self"
    >
      {/* Scroll spacer — left column on desktop; collapses on mobile */}
      <div className="hidden lg:block" aria-hidden="true">
        <div data-phase-sentinel="1" className="h-[100vh]" />
        <div data-phase-sentinel="2" className="h-[100vh]" />
        <div data-phase-sentinel="3" className="h-[100vh]" />
      </div>

      {/* iPhone — pinned during scroll on desktop when pinned=true */}
      <div
        className={cn(
          'flex items-center justify-center',
          pinned && 'lg:sticky lg:top-[10vh] lg:h-[80vh]',
        )}
      >
        <IPhoneChassis size={size} caption={caption}>
          <PhaseScreen activePhase={activePhase}>{phaseContent[activePhase]}</PhaseScreen>
        </IPhoneChassis>
      </div>

      {/* Phase markers — right column, indicates progression to the visitor */}
      <PhaseMarkers activePhase={activePhase} />

      {/* Mobile fallback — show all 3 phases stacked (no scroll-pivot) */}
      <div className="lg:hidden flex flex-col gap-8" aria-hidden="false">
        <MobilePhase number={1} label="Heute">
          <IPhoneChassis size="compact">{phase1}</IPhoneChassis>
        </MobilePhase>
        <MobilePhase number={2} label="Pivot">
          <IPhoneChassis size="compact">
            {typeof phase2 === 'string' ? <PivotSplash text={phase2} /> : phase2}
          </IPhoneChassis>
        </MobilePhase>
        <MobilePhase number={3} label="Morgen">
          <IPhoneChassis size="compact">{phase3}</IPhoneChassis>
        </MobilePhase>
      </div>
    </section>
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
// Bold text, breaks the gallery rhythm, addresses the visitor directly.
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
// PhaseMarkers — small indicator showing which phase is active.
// Sits in the right column on desktop; aids visitor orientation.
// ---------------------------------------------------------------------------
function PhaseMarkers({ activePhase }: { activePhase: Phase }) {
  const labels: Record<Phase, string> = {
    1: 'Heute',
    2: '—',
    3: 'Morgen',
  };

  return (
    <div className="hidden lg:flex flex-col items-start gap-6 self-center" aria-hidden="true">
      {([1, 2, 3] as const).map((p) => (
        <div key={p} className="flex items-center gap-3">
          <span
            className={cn(
              'inline-block h-2 w-2 rounded-full transition-colors duration-300',
              activePhase === p
                ? 'bg-[color:var(--af-pulse,#60A5FA)]'
                : 'bg-[color:var(--af-border-subtle,rgba(1,14,38,0.10))]',
            )}
          />
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              activePhase === p
                ? 'text-[color:var(--af-ink,#010E26)]'
                : 'text-[color:var(--af-ink-muted,#14233E)] opacity-50',
            )}
          >
            {labels[p]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobilePhase — labeled wrapper for the mobile-fallback stacked layout.
// ---------------------------------------------------------------------------
function MobilePhase({
  number,
  label,
  children,
}: {
  number: Phase;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-[color:var(--af-pulse,#60A5FA)]">
          Phase {number}
        </span>
        <span className="text-sm text-[color:var(--af-ink-muted,#14233E)]">— {label}</span>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSS keyframe for fade-in — co-located here to avoid requiring a separate
// stylesheet install. If your project already has an af-fade-in keyframe,
// remove this style block.
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
