# Generator Modes — how the AF Werkschau generator thinks

The AF Werkschau generator (`kundenstimmen-page` and siblings in this registry) produces brand-grade pages from structured customer data. It's not a template — it's a **thinking-mode** wrapped around the registry's primitives. This document defines that thinking-mode.

The generator currently runs in **one mode: Anfragenfluss Mode**. Future modes for per-customer voice/aesthetic are sketched in §7.

---

## 1. What Anfragenfluss Mode IS

**Anfragenfluss Mode is the composable thinking-mode the generator wears when emitting an AF page.** It is NOT a template. It is NOT a config. It is the procedure the generator (and any Claude session using the registry) walks through when transforming structured customer data into a brand-grade page.

The mode sits between three layers:

```
┌─────────────────────────────────────────────────────────────────┐
│  CUSTOMER DATA (MDX frontmatter conforming to                   │
│   KundenstimmenPageData)                                        │
├─────────────────────────────────────────────────────────────────┤
│  ANFRAGENFLUSS MODE — the thinking-procedure (this doc)         │
│  ─ composes three lenses: web design × EM × AF brand canon      │
│  ─ runs hard gates                                              │
│  ─ refuses named anti-patterns                                  │
│  ─ selects primitives from the registry                         │
├─────────────────────────────────────────────────────────────────┤
│  AF REGISTRY PRIMITIVES (this repo)                             │
│   af-tokens / iphone-chassis / whatsapp-chat / scroll-reveal /  │
│   afvq-card-unified / three-phase-iphone-hero / ...             │
├─────────────────────────────────────────────────────────────────┤
│  REACT + NEXT.JS + VERCEL static generation                     │
└─────────────────────────────────────────────────────────────────┘
```

**Why a "mode" and not "the generator":** the generator is code. The mode is doctrine. Code constrains shape; doctrine constrains taste. The generator without the mode would produce structurally-correct pages that fail the AF brand-grade bar. The mode is what makes the output `HOBA-grade`, not `AI-generated-grade`.

**Who reads this:** any Claude session emitting an AF customer page — Joe's AFCO, Damian's Claude, future contributors. The mode is the shared brain. When this doc is followed, two different Claude sessions produce visually consistent output from the same customer data.

---

## 2. The three composing lenses

Anfragenfluss Mode composes three doctrinal layers. They are not stacked — each lens informs the others throughout the generation procedure. The order below is the order of priority **when they conflict**.

### Lens 1 — Anfragenfluss as a brand (af-brand-doctrine + af-design-catalog)

**Source of truth:** `~/.claude/skills/af-brand-doctrine/SKILL.md` (WHY/RULES) + `~/.claude/skills/af-design-catalog/SKILL.md` (WHAT/CHOICES). Always wins on conflict — brand canon overrides general best-practice when the two disagree.

What it carries into the mode:

- **The 8 brand-grade work patterns** (synthesis-from-disparate-inputs, three-phase iPhone hero, real data never placeholder, must beg to be used, 1:1 nachbauen authority, AFVQ-card-unified, WhatsApp-as-trust-medium, Experience-page framing)
- **Damian's vocabulary** (richtig clean / abwechselnd / mittig / zusammenhängend / nackt / knallen) — operational meanings, not literal translations
- **The AF aesthetic anchors** from af-design-catalog (Experience-Page, Internal-Tool, Marketing-Landing, Freigabe-Portal) — the generator only emits Experience-Page tier
- **AFVQ vocabulary** — testimonials are AFVQs (Anfragenfluss Verified Quote), never "Testimonials" or "Reviews"
- **Section ordering canon** for `/kundenstimmen` and sister surfaces (Hero → Filter quiz → Events bubble → Customer cards; narrative not categorical)

When this lens fires LOUDEST: any naming decision (vocabulary, section labels), any aesthetic decision (color, motion register, chassis choice), any content decision (real vs placeholder), any composition decision (alternating left/right, unified frame).

### Lens 2 — Experience Marketing as a strategic frame (EM doctrine)

**Source of truth:** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-experience-marketing-doctrine.md` — the 8-principle doctrine + the Coca-Cola Freestyle worked example. Wins on strategic decisions (does this section earn its place?); yields to Lens 1 on aesthetic/brand-vocabulary execution.

What it carries into the mode:

- **The 8 named principles** — Erlebnisse statt Dienstleistungen / Designed Moment / Vier Erlebnisräume / Anti-Orthodoxie / Psychologischer Mehrwert / Wahre Stimmen / Kanalerlebnis / Erinnerung als Produkt
- **The Designed Moment gate (P2) — the standing operational check.** Before any section is emitted, the mode answers FEEL / DO / REMEMBER for that section. Any axis without a specific answer → the section is a checklist item, not an experience moment. Rework or cut BEFORE emitting.
- **The peak-end discipline (P8)** — every page has ONE designed peak moment + ONE designed ending. Generic submit-confirmation endings fail.
- **The form-as-experience doctrine** — forms are designed-moment surfaces, not utility/conversion mechanics; FEEL/DO/REMEMBER applies per FIELD, not per form
- **The "would they WhatsApp a peer about this?" success metric** — peer-recommendation as the design target, not click-through
- **The data-as-second-payoff principle** — every interaction generates both a brand impression AND a learning signal; both must be designed deliberately

When this lens fires LOUDEST: any section-add/cut decision, any flow ordering decision, any "should this section exist?" question, any CTA destination choice, any form-field design.

### Lens 3 — Good web design as industry-standard hygiene

**Source of truth:** `frontend-design` skill (anti-AI-slop discipline) + `~/lab-reports/2026/anfragenfluss-style/2026-05-16-design-skills-scan.md` (54 vetted resources) + `~/lab-reports/2026/af-werkschau/2026-05-16-effects-best-practices-and-generator-architecture.md` (Part A: timing curves, stagger choreography, `will-change`, `prefers-reduced-motion`, scroll-reveal tuning). Always applied; never overrides Lens 1 or Lens 2 on brand/strategic conflicts.

What it carries into the mode:

- **Timing canon** — Material Motion M2/M3, Apple HIG, Joshua Comeau interactive guide; concrete `cubic-bezier()` values per motion class
- **Stagger choreography** — 100-140ms between stat cards (3-4 max), 100-120ms for notification cascades (3 max), 0ms for hero (single element), 300-600ms for WhatsApp message arrivals (narrative), 40-60ms for long lists (>6 items collapse to simultaneous past item 6)
- **`prefers-reduced-motion: reduce` discipline** — WCAG 2.2 SC 2.3.3; 22.6% of macOS users + higher on Windows. All four animation primitives gate translation and overshoot under this preference; keep opacity fades.
- **GPU hygiene** — dynamic `will-change` (set only during animation, release after). Persistent `will-change` on stacked ScrollReveal wrappers holds 40-90MB GPU memory on a 15-instance kundenstimmen page.
- **Compositor-only properties** — `transform` + `opacity` only; never `top/left/margin/padding` for motion.
- **Animation duration ceiling** — entrance animations cap at 900ms (past 900 reads as "loading" not "appearing"). Current AF scroll-reveal default (720ms) is near the ceiling.
- **Anti-cliché compositions** — NO AI-symmetric Hero / 3-columns-of-features / centered-CTA / 4-step-process / footer pattern. NO purple-to-pink gradient backgrounds. NO em-dash overuse + rule-of-three triplets + title-case section headings in copy.
- **Touch target floor** — 44×44pt minimum (Apple HIG, accessibility-mandatory).
- **Three-viewport verification** — 375 / 768 / 1280 px screenshot check via Playwright before declaring done (the Round-Trip Screenshot Testing pattern in af-brand-doctrine).

When this lens fires LOUDEST: motion timing decisions, accessibility decisions, performance decisions, copy-quality decisions, responsive-layout decisions.

### How the three lenses compose (not stack)

The mode doesn't apply them in sequence — it holds all three simultaneously and asks each question against all three:

| Question the generator asks | Lens 1 (Brand) input | Lens 2 (EM) input | Lens 3 (Web design) input |
|---|---|---|---|
| *"Should this section exist?"* | Does it fit the AF section-ordering canon? | Designed Moment gate — FEEL/DO/REMEMBER specific? | Does it read at all three viewports? |
| *"What chassis goes here?"* | iPhone for trust medium, Mac for desktop tier (per `af-design-catalog`) | Which medium reads as 1:1 documentary for THIS evidence? | Is the chassis variant available in af-registry? |
| *"What motion register?"* | Damian's "richtig clean" / "must beckon" rules | Memory-design (P8) — peak moments earn motion; checklist sections don't | Cubic-bezier per motion class; stagger ≤300ms total; `prefers-reduced-motion` gate |
| *"Real data or placeholder?"* | Real data, never placeholder (Brand-Rule P6/Wahre Stimmen) | Authenticity floor (P6) — DACH-Handwerk detects inauthenticity fast | Show empty state visibly if asset missing; don't fabricate |
| *"What copy register?"* | German default on AF customer-facing; Damian's editorial intensifiers | Anti-Orthodoxie (P4) — name what AF is NOT before what it is | Pass the humanizer rubric (no em-dash spam, no title-case headings) |

When two lenses conflict: Lens 1 wins on aesthetic/vocabulary execution, Lens 2 wins on strategic existence/ordering, Lens 3 wins on accessibility floors. Document the conflict in commit body when material.

---

## 3. The mode interface

### Input contract

The generator consumes a single `KundenstimmenPageData` object per customer page. The full TypeScript shape lives in `components/kundenstimmen-page/kundenstimmen-page.tsx`. Material fields:

```ts
interface KundenstimmenPageData {
  // Identification
  slug: string;                  // URL slug (e.g. "hoba-solar")
  customerName: string;          // Display name
  customerCompany: string;       // Firmenname with legal suffix

  // Hero (Lens 1 + Lens 2)
  eyebrow: string;               // "HOBA Solar GmbH · Q1 2026"
  heroBefore: string;            // "Von 4 Anfragen/Woche zu"
  heroAfter: string[];           // Typewriter-rotated outcomes
  heroLead: string;              // Single-sentence positioning

  // Proof (Lens 2 — Designed Moment gate per stat)
  before: { metric: string; value: string; };
  after: { metric: string; value: string; };
  proofStats: Array<{ value: string; label: string; }>;  // 3-4 stat cards

  // WhatsApp testimonial (Lens 1 — real artifacts, no placeholder)
  whatsappMessages: Array<{
    direction: "in" | "out";
    body: string;
    voiceMessage?: { audioSrc: string; durationSec: number; waveformPeaks?: number[]; };
    timestamp?: string;
    delivered?: boolean;
    read?: boolean;
  }>;

  // AFVQ video (optional — Lens 1: real customer video or absent, never placeholder)
  afvqVideo?: { videoSrc: string; posterSrc: string; durationSec: number; };

  // YouTube case study (optional)
  youtubeVideoId?: string;
  youtubeTitle?: string;
  youtubeChannelHandle?: string;

  // Pull quote (Lens 1 — AFVQ vocabulary, never "Testimonial")
  pullQuote: { text: string; attribution: string; };

  // Social proof notifications (Lens 2 — narrative sequencing per Joshua Comeau)
  socialProofNotifications: Array<{
    senderName: string;
    senderHandle: string;
    body: string;
    avatarSrc: string;
  }>;

  // CTA (Lens 2 — peak-end design; this IS the ending)
  cta: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
}
```

### Output contract

A fully-static `KundenstimmenPage` React component rendered at build time, deployable as a Next.js static page at `/kundenstimmen/[slug]`. Properties of the output:

- **Visually consistent** with every other AF Werkschau-generated page (Lens 1 brand-grade bar)
- **Strategically coherent** — every section passes the Designed Moment gate (Lens 2)
- **Industry-standard hygienic** — motion timing, accessibility, performance pass external rubrics (Lens 3)
- **Zero runtime dependencies** — pure static HTML+CSS+JS, no DB calls, no API keys exposed, no rate limits

### What's NOT in the interface (deliberately)

Animation parameters, motion timing, color tokens, section ordering — none of these are data-driven. They live in the generator code (Lens 1: consistency over flexibility at solo-operator scale per the af-werkschau architecture lab). Adding them to the interface would put taste decisions in customer data, which violates the low-friction onboarding goal (8-12 min for customer #11 per the lab).

The ONLY data-driven motion parameter is implicit stagger (the `i * 140` math) which handles N-stat-cards or N-notifications dynamically.

---

## 4. The walking procedure — what the mode DOES at generation time

When a `KundenstimmenPageData` object arrives at the generator, the mode walks this procedure. **The procedure runs at brief-writing time (Joe / Damian shaping the MDX) AND at runtime (the component composing the output).** Both readers apply the same checks.

### Step 1 — Parse the data, sanity-check against the schema

- TypeScript schema validation runs first. Missing required fields → build fails. Wrong types → build fails. (Per af-werkschau lab Part B: the schema IS the validator.)
- All asset paths are resolved. Missing assets surface visibly as "ASSET MISSING — fetch from Drive" (Lens 1: real data, never placeholder).
- AFVQ vocabulary check — pull-quote attribution uses the customer's actual name + firma; no "Customer A" placeholder anywhere.

### Step 2 — Apply the Designed Moment gate per section (Lens 2)

For each section the page will emit, the mode answers internally:

- **FEEL** — what does the visitor feel when they reach this section? (specific emotional register — *curiosity*, *recognition*, *peer-pull*, *trust transferred from the artifact*)
- **DO** — what specific action does this section invite? (a meaningful choice, a self-identification, a controlled disclosure, a play of the testimonial video)
- **REMEMBER** — what does the visitor carry away from this section? (a specific peak moment, a customer's actual face/voice, a stat they can repeat)

**If any section fails the gate on any axis → the mode flags the section for rework or removal BEFORE emitting.** This is the standing operational check from the EM doctrine.

Sections that pass the gate by design (when populated with real data):
- Hero (three-phase iPhone) — FEEL: documentary recognition; DO: scroll to pivot; REMEMBER: the customer's actual voicemail
- AFVQ card — FEEL: peer-trust; DO: click-to-play; REMEMBER: the customer's face + the specific stat
- Pull quote — FEEL: editorial settle; DO: read-once; REMEMBER: the specific wording
- CTA — FEEL: invitation to be the next page's subject; DO: book Erstgespräch; REMEMBER: "this could be me"

Sections that fail the gate by default (must NOT be emitted as checklist items):
- Generic "About us" — fails REMEMBER (nothing specific)
- Three-pill badges — fails FEEL (Damian rejected as *"zu schwammig"*)
- Generic features grid — fails FEEL + REMEMBER (AI-cliché)
- Stock-photo team grid — fails Wahre Stimmen (Lens 1: real data only)

### Step 3 — Pick the right primitives from the registry (Lens 1 + Lens 3)

For each section that passed Step 2, the mode selects primitives:

| Section role | Primitive composition | Notes |
|---|---|---|
| Hero (3-phase narrative arc) | `three-phase-iphone-hero` + `iphone-chassis` + `whatsapp-chat` (phase 1) + splash text (phase 2) + `reels-feed` or `email-inbox` or `instagram-profile` (phase 3) | Must use 3 DIFFERENT mediums per Lens 1 |
| Stat card row | 3 styled stat blocks wrapped in `scroll-reveal` (stagger `i * 140`) | Lens 3 timing canon |
| AFVQ section | `afvq-card-unified` alternating left/right via `variant` prop | Lens 1 "abwechselnd" pattern |
| WhatsApp testimonial deep-dive | `iphone-chassis` (immersive) + `whatsapp-chat` with real voicemails | Lens 1 WhatsApp-as-trust-medium |
| YouTube case study (optional) | `youtube-player` (embed layout fits iPhone, desktop layout fits Mac) | Lens 1 chassis matches viewport |
| Social proof feed | Stack of `af-ios-notification` + `notification-arrive` (stagger `i * 120`) | Lens 3 cascade timing |
| Pull quote | Static block inside single `scroll-reveal` (no stagger) | Lens 3 stillness discipline |
| CTA section | Headline + button + optional decorative `liquid-glass-frame` | Lens 1 "must beg to be used" |

**If a section needs a primitive not in the registry → the mode flags it as a registry-gap, does not improvise.** The af-design-catalog `MUTATION.md` discipline applies: new primitives go through the registry, not inline in customer pages.

### Step 4 — Emit structural mock-up for review (Joe directive 2026-05-17)

Before writing motion composition or final React code, the mode emits an ASCII-art layout sketch showing the planned page structure. The mock-up captures:

- **The column grid** — annotated breakpoint (e.g., `Left 6/12 lg` / `Right 6/12 lg`)
- **Editorial labels** for visual emphasis — `THE SPIKE`, `mediaday-glow halo`, anything naming the section's role in the narrative
- **The named content slots** within each column — AFVQ eyebrow chip, H1 with style note (`italic SHK-Meister glow`), lead paragraph, stat row, CTAs, insets
- **The anchor primitives** that will fill each slot — `ThreePhaseIphoneHero` with its Phase 1 / Phase 2 / Phase 3 tree explicit, `AfvqCardUnified`, `EmailInbox`, etc.
- **Short content placeholders** showing what each slot will display — `"Fallstudie · 01 · HOBA"` in the eyebrow, `~15 / 300+ / SHK & PV / S-DE` in the stat row, `"Wann bist DU dran?"` in Phase 2 of the hero

**Mock-up canonical shape** (reference: 2026-05-17 Joe-shared example for a HOBA Fallstudien page):

```
┌— Left 6/12 lg ——————————————————┬— Right 6/12 lg — THE SPIKE —┐
│ AFVQ eyebrow chip                │  ┌— ThreePhaseIphoneHero —┐  │
│ "Fallstudie · 01 · HOBA"         │  │ ├— Phase 1: Maps        │  │
│                                  │  │ │   Waldkirch zoom      │  │
│ H1 — italic SHK-Meister glow     │  │ ├— Phase 2: Splash      │  │
│                                  │  │ │   "Wann bist DU?"    │  │
│ Lead paragraph                   │  │ └— Phase 3: Reels       │  │
│                                  │  │     real HOBA ads       │  │
│ 4-col stat row                   │  │                         │  │
│ ~15 / 300+ / SHK & PV / S-DE     │  │ mediaday-glow halo      │  │
│                                  │  └—————————————————————————┘  │
│ [Sechs Phasen lesen →] [LeadCta] │                                │
│                                  │                                │
│ [Small inset HobaMap — fixed]    │                                │
└——————————————————————————————————┴————————————————————————————————┘
```

**Review handoff.** Joe / Damian reviews the mock-up at this point. Approve → continue to Step 5 (motion composition). Reject → return to Step 2 (Designed Moment gate, if the section list is wrong) or Step 3 (primitive pick, if primitives are wrong), revise, re-emit mock-up.

**Why this step exists.** Cost is ~2 minutes of ASCII drawing; benefit is catching structural problems (wrong column ratio, wrong primitive choice, missing slot, off-canon section ordering, editorial labels mismatched to content) BEFORE motion composition and code commits force a costly unwind. Applies generator-agnostic — kundenstimmen pages, fallstudien chapters, marketing landings, freigabe-portal pages — not just kundenstimmen. The mock-up is the bridge between doctrine and code; it's where the doctrine is visible before being committed.

### Step 5 — Compose motion at the right register (Lens 3 + Lens 1)

For each composing primitive, the mode applies the motion canon:

- **Entrance translation** — `SwipeIn` with `cubic-bezier(0.22, 1, 0.36, 1)` / 320-480ms
- **Settle/spring** — `NotificationArrive` with `cubic-bezier(0.34, 1.56, 0.64, 1)` / 500-700ms (ONLY for actual notifications — overshoot on other elements reads as jitter per Lens 3 anti-pattern #5)
- **Scroll reveal** — content-class-aware `threshold` + `rootMargin` per the af-werkschau lab Part A.3 tuning table:
  - Hero / above-fold → `threshold: 0.05` + `rootMargin: '0px 0px -40px 0px'`
  - Stat cards → defaults (`0.15` / `-80px`)
  - iPhone section → `threshold: 0.10` + `rootMargin: '0px 0px -60px 0px'`
  - Pull quote → `threshold: 0.25` + `rootMargin: '0px 0px -100px 0px'`
  - Social proof → `threshold: 0.10` + `rootMargin: '0px 0px -60px 0px'`
  - CTA → `threshold: 0.20` + `rootMargin: '0px 0px -80px 0px'`
- **Stagger** — `i * 140` for stat cards, `i * 120` for social proof, `300-600ms accelerating` for WhatsApp messages, NO stagger for single hero element
- **`prefers-reduced-motion` gate** — translation collapsed to 0, overshoot replaced with `ease`, opacity fade preserved as state-change signal
- **`will-change` hygiene** — dynamic per the af-werkschau lab Part A.6: `willChange: revealed ? 'auto' : 'transform, opacity'`

### Step 6 — Run the web-design hygiene pass (Lens 3)

Before emission, the mode checks:

- **Three viewports** — 375 / 768 / 1280 px layouts hold. No horizontal scroll at 375. No clipped text. All touch targets ≥ 44×44pt.
- **Typography** — brand fonts loaded; no AI-default serif/sans drift; letter-spacing + line-height per af-tokens
- **Color** — only AF palette tokens; no generic AI gradient backgrounds (the purple-to-pink tells)
- **Copy** — passes humanizer rubric (no em-dash overuse, no rule-of-three triplets, no title-case section headings, no "significance inflation"); German-first on AF customer-facing surfaces
- **Layout** — asymmetry where deliberate; NOT the AI-cliché (Hero / 3-cols / centered-CTA / 4-step-process / footer pattern)

### Step 7 — Run the brand-canon checks (Lens 1)

Before emission, the mode confirms:

- **Section ordering** matches Experience-Page canon (Hero → Filter quiz where present → Events → Customer cards), narrative not categorical
- **AFVQ vocabulary** — never "Testimonial," never "Review," always AFVQ or *Kundenstimme* in German
- **Real data only** — every visible content element traces to a real customer / asset / value. Missing assets surface as "ASSET MISSING" not as fabricated placeholder.
- **No rejected patterns** — no three-pill badges, no auto-play with sound, no infinite decorative animations
- **Damian's vocabulary applied** — "richtig clean" tightening on chrome; "abwechselnd" on AFVQ rows; "mittig zum handy" on adjacent elements; "knallen" register only where the section earns the visual weight

### Step 8 — Emit the page + write the verification trail

The component renders. A `git commit` lands with:

- Atomic per-section commits when the page is built up in stages (per `~/.claude/rules/atomic-commit.md`)
- Commit body documents any cross-AF asset lifts ("hero cloned from zusammenarbeit per Damian-mode lift authority")
- After emission, the Playwright round-trip screenshot test fires at three viewports (per af-brand-doctrine § Round-Trip Screenshot Testing): typography / color / layout / copy / mobile / tablet / desktop each scored 0-100; rework any axis < 80; repeat until all ≥ 80.

---

## 5. The hard gates (non-negotiable)

These seven checks BLOCK emission. They are not "warnings." A page that fails any one of them is not emitted under Anfragenfluss Mode.

| # | Gate | What it checks | What blocks emission |
|---|---|---|---|
| 1 | **Designed Moment** | FEEL / DO / REMEMBER on every section | Any section without specific answer on any axis |
| 2 | **Wahre Stimmen / Real-data** | Every visible content element traces to a real customer | Any placeholder, fabricated quote, stock photo, or `customer_name = "Customer A"` |
| 3 | **AFVQ vocabulary** | Pull quotes labeled correctly | Any "Testimonial," "Review," or generic-marketing-vocab leak |
| 4 | **`prefers-reduced-motion`** | All four animation primitives gate translation + overshoot | Any primitive that animates unconditionally regardless of preference |
| 5 | **Three-viewport responsive** | 375 / 768 / 1280 px hold | Horizontal scroll, clipped text, broken layout, sub-44pt touch targets at any viewport |
| 6 | **Brand-rejected patterns absent** | Three-pill badges / auto-play-with-sound / infinite-decoration loops | Any of the named rejected patterns from af-brand-doctrine § anti-patterns |
| 7 | **Structural mock-up reviewed** (Joe directive 2026-05-17) | The Step-4 ASCII layout sketch has been seen and approved by Joe / Damian before motion composition begins | Any attempt to skip Step 4 OR proceed to Step 5 without an approval signal on the mock-up |

**Visible failure mode:** when a gate trips, the mode does NOT silently degrade. It surfaces the gap (e.g., `<div className="asset-missing-overlay">ASSET MISSING — placeholder.mp4</div>`) so the build shows the gap rather than hiding it under fabricated content. Lens 1 + Lens 2 unite on this — "show the gap" beats "fill the gap with fake content" on every axis.

---

## 6. Anti-patterns this mode refuses

Concrete list. When the generator detects any of these in the input data or the proposed composition, it surfaces the violation and does not emit silently.

### Composition violations

- **Three nested levels of animation primitives on the same element** — `SwipeIn > NotificationArrive > PressLike` simultaneously. The eye doesn't know what to track. Lens 3 anti-pattern #1.
- **Two different animations on the same spatial zone at the same time** — the inner animation cancels the outer perceptually. Sequence via `delayMs` or pick one.
- **Section ordering off-canon** — putting "Events bubble" before "Hero," or "CTA" before "Pull quote." The narrative arc fails.
- **More than 6 stagger items** — past 6 elements, stagger creates a 400ms+ gap between first and last that reads as a broken page. Past item 6, remaining items reveal simultaneously.

### Motion violations

- **Spring overshoot on non-notification elements** — `NotificationArrive` easing on a hero headline reads as jitter. Reserved for elements that ARE notifications.
- **Duration > 900ms on entrances** — reads as "loading" not "appearing." Cap at 900; AF default 720 is near the ceiling.
- **Permanent `will-change` on persistent wrappers** — 4-6MB GPU memory per layer × 15 layers on a kundenstimmen page = 60-90MB held indefinitely. Use dynamic `will-change` per the af-werkschau lab.
- **`top` / `left` / `margin` / `padding` for motion** — 4-10× the work per frame vs `transform` + `opacity`. Compositor-only properties only.
- **Infinite decorative animations** — the `.mehr-infos-btn` pulse on every card pattern from the 2026-05-15 UX audit. Reserved for genuine status indicators (loading, progress, blink).
- **Scroll-reveal on above-the-fold content** — fires immediately anyway; risks flash of hidden content if JS is slow. Above-fold uses SwipeIn at mount or static render.

### Content violations

- **Lorem ipsum / placeholder text anywhere** — every visible word traces to a real customer or AF doctrine.
- **Stock photos** — Wahre Stimmen rule. Customer photos are real customer photos.
- **Auto-play video with sound on page load** — Lens 1 brand rule. Click-to-play with sound is the canon.
- **AI-cliché copy patterns** — em-dash overuse, rule-of-three triplets, title-case section headings, synonym cycling, significance inflation. Lens 3 humanizer rubric.
- **Generic features grid as a section** — fails the Designed Moment gate by construction. If features matter, they live inside a designed moment (e.g., a customer card surfacing what changed for THEM).

### Schema violations

- **Customer data missing required fields** — TypeScript build fails, not runtime fails. The schema IS the validator.
- **Asset path references files not in repo** — visible "ASSET MISSING" surfaces; build does not silently substitute.
- **Animation parameters in the input data** — animations are hard-coded in the generator for consistency. Adding `customAnimation: {...}` to a customer record violates Lens 1 consistency principle.

### Brand violations (Lens 1 specifics)

- **AFVQ called "Testimonial"** or "Review" or "Quote-from-customer" — Anfragenfluss Verified Quote, period.
- **Three-pill badges** (Sofort / Proaktiv / Langfristig) — Damian rejected as *"zu schwammig."*
- **WhatsApp chassis without real chrome** — fake bubble UI fails Lens 2 anti-pattern #2 (Manufactured Intimacy). Real avatar + sender name + customer firm + audio waveform with duration + relative timestamp + sequenced delivery + open-keyboard for active state. Or no WhatsApp chassis.
- **English-tech vocab in a Damian-mode session** — `atomic commit` instead of *"ein sauberer Commit pro Änderung"*.
- **3-phase iPhone hero with 3 screens of the same app** — three DIFFERENT mediums per af-brand-doctrine § 2.

---

## 7. Pre-mortem — what could break this generator

Per Damian's directive on 2026-05-16 (Holbeinstraße audio, transcribed in `~/.claude/personal/damian-context.md`): *"denken, was so dumm könnte, was nicht zu sein, um irgendwas kaputt oder falsch zu machen."* — think what stupid thing could happen, what shouldn't be there, that might break or do it wrong.

§ 6 covers anti-patterns in pages **emitted**. This section covers failure modes of the **generator system itself** (the registry + the mode + the build pipeline + the doctrine doc). Both crash failures AND silent-wrong failures. Sorted by likelihood × severity, highest first.

### 7.1 Failure-mode inventory

| # | Failure mode | Trigger | What breaks (silently or loudly) | Severity × Likelihood |
|---|---|---|---|---|
| 1 | **Designed Moment gate rubber-stamps** | FEEL/DO/REMEMBER answered with generic boilerplate ("FEEL: trust · DO: scroll · REMEMBER: AF") that satisfies the gate's text but not its intent | Silent. Brand-grade output degrades over months without any single page failing. The mode passes; the bar drops. | H × H |
| 2 | **Cross-Claude doctrine drift** | Damian's Claude and Joe's AFCO interpret lens-priority differently because each session loads with different surrounding context | Silent. Same customer data produces different pages across sessions. Brand consistency erodes. | H × M |
| 3 | **Schema migration breaks existing MDX** | A required field added to `KundenstimmenPageData` | Loud. Every existing customer MDX file fails the TypeScript build. Deploy blocks. | H × M |
| 4 | **Registry primitive deprecation cascades** | A "minor" prop change to `iphone-chassis` is shipped to the registry without semver discipline | Loud. `three-phase-iphone-hero` breaks. Every consumer page breaks. Customer pages go 500 on production. | H × M |
| 5 | **Hybrid routing branch never decommissions** | The `if MDX exists use new else use old` branch in `anfragenfluss-kundenstimmen` stays forever; HOBA Solar never migrates | Silent. New customers on new generator; HOBA Solar on legacy route; visual inconsistency between customers nobody notices. | M × H |
| 6 | **Asset-missing fallback becomes the default** | The "ASSET MISSING — fetch from Drive" red box ships to production because nobody fetches assets | Loud (in dev) but silent (in production if nobody opens the page). Customer pages with placeholder boxes go live. Brand humiliation when the customer sees their own page. | M × M |
| 7 | **Performance cliff at 50+ customers** | Build time was sub-30s at 5 customers; becomes 5+ minutes at 50; image asset count past 400 makes `git status` slow | Silent gradually. Deploy cycle slows. Edit-cycle suffers. No clear "this broke" moment. | M × M |
| 8 | **Content arriving in unsupported medium** | Damian sends a voice memo describing a video case study; or a customer artifact arrives as a LinkedIn DM thread; schema has no home | Either: schema explodes ad-hoc (`videoCaseStudy?: {...}` accreted inline) OR content force-fits into wrong primitives (a Reels feed component used to display a LinkedIn thread) | H × L |
| 9 | **AFVQ vocabulary leak** | A page ships with "Testimonial" or "Review" because nobody enforces vocabulary in CI | Silent. Brand canon erosion compounds quietly across customer pages. Damian catches one and asks "wer hat das so geschrieben?" | L × L |

### 7.2 Mitigations and watch-signals per failure mode

**#1 — Designed Moment gate rubber-stamps.** Mitigation: gate-application requires a customer-evidence-tied answer per section (NOT "trust" but *"trust that HOBA's growth math is real because the voicemail is THEIR voice"*). Watch-signal: when reviewing a draft, the gate's FEEL answer is interchangeable between two different customers' pages → gate is being rubber-stamped, rework before emit. AFCO and Damian's Claude both catch this at review time.

**#2 — Cross-Claude doctrine drift.** Mitigation: this doc + `af-brand-doctrine` skill version-pinned together; doctrine changes require explicit doc-bump committed to git. Watch-signal: two Claudes produce visibly different layouts/copy from the same `KundenstimmenPageData` → run `diff` on the output; the divergence diagnoses the doctrine-loading gap.

**#3 — Schema migration breaks existing MDX.** Mitigation: new fields ALWAYS `optional?` by default; deprecation gets explicit codemod / migration script; never remove a field, only add new optional ones. Watch-signal: TypeScript build errors mentioning "Property X is missing" in a customer MDX file → schema went required without migration.

**#4 — Registry primitive deprecation cascades.** Mitigation: strict semver in `registry.json` per component; component-dependency graph validated on every registry mutation; breaking changes require major bump + migration note in commit body. Watch-signal: a "small fix" PR to a primitive changes prop names or signatures → must be major bump, not minor.

**#5 — Hybrid routing branch never decommissions.** Mitigation: explicit decommission target in the af-werkschau lab's 90-day roadmap (Week 4: migrate HOBA Solar; Week 12: remove the branch). Watch-signal: > 1 customer remaining on the old route at Week 8 → the migration is stalling; surface to Joe.

**#6 — Asset-missing fallback becomes default.** Mitigation: build fails (`exit 1` in the build script) when any "ASSET MISSING" overlay exists in the production-mode output. Dev mode preserves the visible-gap signaling; prod mode refuses to ship gaps. Watch-signal: a deploy attempt fails with the asset-missing message → fetch the asset before retry, never bypass.

**#7 — Performance cliff at 50+ customers.** Mitigation: per the af-werkschau lab Part C.2 — evaluate admin panel + asset-CDN migration when count crosses 25; never let the count hit 50 without that evaluation. Watch-signal: Vercel build time > 60 seconds on a customer page change → past the comfortable zone; investigate.

**#8 — Content arriving in unsupported medium.** Mitigation: schema has a `schemaVersion: number` field; new media types require an explicit schema bump + new primitive in the registry (per the registry mutation discipline) — never inline ad-hoc fields. Watch-signal: a customer brief arrives requesting a section type that has no schema home → STOP, design the schema extension + primitive properly via the registry mutation flow, don't improvise inline.

**#9 — AFVQ vocabulary leak.** Mitigation: build-time grep for forbidden vocabulary (`Testimonial`, `Review`, `Quote from customer`) in customer MDX files; CI fails on match. Watch-signal: any of the forbidden words slip through code review → the grep is broken or missing; restore.

### 7.3 The deeper risk — doctrine drift

Beyond the inventory above, the meta-failure mode: **this doc itself becomes stale doctrine.** The skills evolve, the registry evolves, the lenses evolve — and this doc references an older state of all three. Two months later, the mode says one thing and the code does another. Mitigation: this doc gets reviewed on every af-brand-doctrine skill bump, every major registry mutation, every lens-source lab update. The version-pin discipline applies to the doc itself, not just to the things it references.

When the doc and the code disagree, **the code wins** (code is the executable layer; doctrine drifts but code is what users see). When the doc and a skill disagree, **read both and surface the conflict to Joe + Damian for resolution**. Don't paper over silently.

---

## 8. Future expansion — *was kann auch dazu kommen*

Per Damian's directive on 2026-05-16 (same Holbeinstraße audio): *"Wenn du den Generator machst, dann musst du überlegen, was kann auch dazu kommen."* — when building the generator, think about what ELSE could come in the future.

This section sketches the expansion paths. **None are built.** The intent is to design the foundation so these paths remain open — not to build them now.

The expansion divides into three groups:
- **A. Other generator types** (sibling generators to `KundenstimmenPage`)
- **B. Modes within kundenstimmen-style generators** (per-customer / per-segment voice)
- **C. Composable layers crossing all generators** (orthogonal capabilities)

### 8.A — Other generator types

`KundenstimmenPage` is the first generator. The registry + mode model extends to other generator types that share most of the doctrine. Each sibling generator gets its own `<generator>-MODES.md` doc next to its components in the registry; this doc becomes the index for `kundenstimmen` and the pattern for the others.

| Generator type | What it would produce | Schema sketch | Doctrine reuse from Anfragenfluss Mode |
|---|---|---|---|
| **Fallstudien Generator** | Long-form case studies, chapter-based, deep technical narrative | `FallstudienPageData` — chapters[], hero, conclusion, attached AFVQs | Lens 1+2+3 fully apply; section ordering differs (chapter narrative, not testimonial sequence); existing components in `anfragenfluss-fallstudien` codebase guide the schema |
| **Marketing Landing Generator** | Campaign-specific landing pages (Meta-ad funnels, partner campaigns) | `MarketingLandingData` — value prop, social proof, lead capture form, CTA | Lens 1 (Marketing-Landing anchor from af-design-catalog); Lens 2 (form-as-experience doctrine — every field FEEL/DO/REMEMBER); Lens 3 fully applies |
| **Email Sequence Generator** | Outbound email sequences per customer cluster (cold outreach, nurture, win-back) | `EmailSequenceData` — touchpoints[], variants, schedule, channel | Lens 1 vocabulary (German register, no English-tech leak); Lens 2 Kanalerlebnis (email IS the channel surface); Lens 3 partially (email constraints differ — no `prefers-reduced-motion`, no responsive viewports in the same sense) |
| **Freigabe-Portal Page Generator** | Internal customer-approval pages (Damian and Joe submit work, customers approve/comment) | `FreigabePortalData` — assets to approve, status, comments, change-requests | Lens 1 (Freigabe-Portal anchor); Lens 2 (Designed Moment per approval step — "what does the customer FEEL when they see this for the first time?") |
| **Job Listing Generator** | AFJC job posts from Damian's voice/text intake → SPEC.md skeleton | `JobListingData` — task, acceptance criteria, constraints, references | Tied to existing `2026-05-14_l07` work on `/post-joblisting`; reuses Damian's brief-template (identity + reference + one-line directive + trust marker) as the schema seed |
| **Social Snippet Generator** | IG carousels + LinkedIn posts derived from kundenstimmen pages | `SocialSnippetData` — slides[], hook, CTA, platform-specific dimensions | Lens 1 vocabulary; Lens 2 peak-end PER SLIDE (each carousel slide is its own micro-experience); Lens 3 partial (platform format constraints override some web-design choices) |
| **PDF / Print Generator** | Trade-fair handouts, sales materials, customer take-home Fallstudien | `PrintPageData` — print-optimized layout, page-break aware, CMYK color profile | Lens 1 fully; Lens 3 differs significantly (print typography vs web, no motion, no responsive, fixed page dimensions) |

**The shared foundation across all generator types:**
- AF design tokens (`af-tokens` in the registry) — generator-agnostic
- Lens 1+2 doctrine — both apply to every AF customer-facing surface
- The registry primitives — most compose across generators (iphone-chassis works in kundenstimmen AND fallstudien chapter heroes AND social snippet slides)
- MDX-in-repo content architecture — works for every generator type

**What's generator-specific (the per-generator-mode doc):**
- The walking procedure (which sections fire in what order)
- The schema shape
- The hard gates list (some gates are universal, some are generator-specific)
- The anti-patterns (some are universal, some are generator-specific)

### 8.B — Modes within kundenstimmen-style generators

The original per-customer mode path. Customer-specific modes wrap Anfragenfluss Mode and override specific decisions for THIS customer's aesthetic and voice.

**Example modes** (none built):
- **HOBA Solar Mode** — industrial PV vocabulary, dark color register dominance, technical-credibility-forward copy (sizing data, conversion math, GF-direct quotes)
- **Roofing Mode** — local-trade vocabulary, warm color register, peer-trust-forward copy (Innungs-Kollege endorsements, fast-response stories)
- **SHK Mode** — Sanitär-Heizung-Klima vocabulary, family-business-trust register, multi-generational-story copy
- **Industrial-B2B Mode** — formal vocabulary, gray-blue register, decision-committee-friendly copy (procurement-vetted, ROI-explicit)

**Inherit + override model** (not replace):

```
┌─────────────────────────────────────────┐
│  CUSTOMER DATA                          │
├─────────────────────────────────────────┤
│  CUSTOMER MODE (e.g. HOBA Solar Mode)   │
│    overrides: copy register, color emph,│
│    specific section choices             │
│  ↓ inherits from ↓                      │
│  ANFRAGENFLUSS MODE (default)           │
│    composes: 3 lenses, gates,           │
│    anti-patterns, walking procedure     │
├─────────────────────────────────────────┤
│  AF REGISTRY PRIMITIVES                 │
└─────────────────────────────────────────┘
```

A customer mode CAN override:
- Section ordering nuances (e.g., HOBA leads with proof-stat hero; Roofing leads with peer-WhatsApp hero)
- Copy register tuning (formality level, technical-density)
- Color emphasis within the AF token palette
- Which optional sections fire (AFVQ video required vs optional)

A customer mode CANNOT override:
- The 6 hard gates from § 5 (non-negotiable)
- The 3-lens composition order (Lens 1 wins aesthetic / Lens 2 wins existence / Lens 3 floors)
- The af-tokens palette (only EMPHASIS within it)
- The registry primitives (can only choose among them, not invent new ones inline)

**When to graduate from default Mode to per-customer Modes:**

| Threshold | Signal | Action |
|---|---|---|
| **3-5 customers in one segment** | E.g., 3 PV customers, 3 SHK customers, 3 roofers | Audit whether their pages would benefit from distinct register; if yes, draft the first per-customer mode |
| **Damian asks for it** | Manual brief signals like *"die HOBA Seite fühlt sich anders an als die Volt-On-Seite — passt das?"* | The brief IS the trigger; draft the mode from his correction vocabulary |
| **A customer explicitly requests a different aesthetic** | E.g., a customer says their brand register conflicts with AF default | Mode-fork as the response, not an inline override |

**Why this is v2 territory, not v1:**
- Default consistency wins at 10-25 customers (per the af-werkschau lab Part C.1)
- Per-customer modes add tuning surface per customer — violates the 8-12 minute onboarding goal until reusable
- Empirical justification doesn't exist yet — AFCO doesn't know which segments cluster

### 8.C — Composable layers crossing all generators

Layers that aren't generator-specific. They compose with whichever generator fires.

| Layer | What it adds | When justified |
|---|---|---|
| **Voice-memo intake** | Damian sends a voice memo → Whisper transcribes → mode parses → drafts MDX scaffold conforming to the right generator's schema | When voice-memos arrive frequently (per the `~/.claude/personal/damian-context.md` audio-transcription workflow already in place) |
| **CRM-driven content population** | Close customer record (industry, MA-Zahl, GF-name, campaign data) → pre-populate MDX fields | At 25+ customers where data hygiene becomes critical AND when Close enrichment is reliable |
| **n8n workflow integration** | Customer onboarding completion event → generator runs → Vercel preview deploys → Damian-Claude verification pings | When customer onboarding is automated end-to-end (post-ACAT V2) |
| **Personalization layer** | Per-visitor adjustment of which sections fire (e.g., a returning visitor sees a different CTA than a first-time visitor) | Only at scale where A/B testing justifies the analytics dependency; not before 50+ customers + measurable traffic |
| **Multilingual variants** | German / English / Spanish versions of the same generator output | When international expansion materializes; held for later |
| **A/B variant generator** | Generate page variants for A/B testing (different hero versions, different CTA placements) | At 50+ customers with traffic to A/B; out of scope today |
| **AFAI voice integration** | The generator's mode-doctrine voice is consulted by the customer-facing AFAI for live questions about a kundenstimmen page | Tied to the AFAI direction work (`~/lab-reports/2026/afco-architecture/2026-05-16-afai-direction.md`); out of scope until AFAI ships |

These are NOT mode-specific. They're orthogonal layers that compose with any generator. Building them as separate concerns keeps the generator-mode docs focused on the THINKING-procedure, not the integration-procedure.

### 8.D — Anchor: Damian's anticipatory framing

The discipline this section operationalizes (Damian, Holbeinstraße 2026-05-16):

> *"Wenn du den Generator machst, dann musst du überlegen, was kann auch dazu kommen."*
> Build the foundation so future paths don't require ripping out the foundation. The current generator (`KundenstimmenPage`) is the first instance — design assuming there will be others, plural.

**Concrete actions taken at v1 to keep paths open:**

1. **Mode doctrine lives in its own file** (this doc) — not buried in `kundenstimmen-page.tsx` code, so future generators can compose against the same doctrine
2. **Lens 1+2+3 are independent of generator type** — the lens model isn't kundenstimmen-specific
3. **Registry primitives are atomic** — `iphone-chassis`, `whatsapp-chat`, etc. compose into kundenstimmen pages today; can compose into fallstudien chapters tomorrow
4. **`af-tokens` is generator-agnostic** — the design tokens don't care which generator consumes them
5. **MDX-in-repo architecture is generator-agnostic** — fallstudien, marketing landings, etc. all use the same file pattern
6. **The composable-layers list (§ 8.C)** is generator-agnostic — voice-memo intake works for any generator, not just kundenstimmen
7. **`schemaVersion` field in customer data** (per § 7.2 mitigation #8) — new media types extend the schema without breaking old MDX

**What v1 explicitly does NOT do (deliberate restraint):**
- Build any of the sibling generators (§ 8.A) — premature; first prove the model on kundenstimmen
- Build per-customer modes (§ 8.B) — wait for the 3-5 customers per segment threshold
- Build composable layers (§ 8.C) — each one earns its keep at a specific scale or workflow trigger, not before

---

## 9. Cross-references

### Doctrine sources (read these for deep WHY)

- **AF brand canon (Lens 1 — WHY/RULES):** `~/.claude/skills/af-brand-doctrine/SKILL.md` — 8 brand-grade patterns, Damian-mode detection, Damian's vocabulary, Round-Trip Screenshot Testing
- **AF design choices (Lens 1 — WHAT/CHOICES):** `~/.claude/skills/af-design-catalog/SKILL.md` — named aesthetic anchors, color palettes, font pairings, operational tooling per EM layer
- **Experience Marketing doctrine (Lens 2):** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-experience-marketing-doctrine.md` — 8 principles, Coca-Cola Freestyle worked example, Pine & Gilmore / Schmitt / Holt / Sutherland citations
- **Design resources scan (Lens 3 — WHAT):** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-design-skills-scan.md` — 54 vetted resources, top-5 adoption shortlist (Lenis, Tailwind v4 + OKLCH, shadcn MCP, Radix Primitives, Geist)
- **AF Werkschau effects + architecture (Lens 3 — HOW):** `~/lab-reports/2026/af-werkschau/2026-05-16-effects-best-practices-and-generator-architecture.md` — timing curves, stagger choreography, `will-change` hygiene, `prefers-reduced-motion` discipline, scroll-reveal tuning, MDX-in-repo decision
- **Frontend design skill (Lens 3 — discipline):** `~/.claude/skills/frontend-design/SKILL.md` — anti-AI-slop, distinctive aesthetics, production-grade output

### Damian-source layer (read these for HOW HE THINKS about this generator specifically)

- **Holbeinstraße audio transcript (2026-05-16):** `~/.claude/personal/damian-context.md` Entry 1 — Damian's verbatim feedback on building the generator: anticipatory thinking + pre-mortem + 1-2-hour scope honesty + execution-is-Damian's-strength. THIS doc's § 7 (pre-mortem) and § 8 (anticipatory expansion) operationalize his framing.
- **Damian's brief template** (af-brand-doctrine § "Brief like Damian") — identity + reference + one-line directive + trust marker
- **Damian's vocabulary** (af-brand-doctrine § "Damian's vocabulary") — operational lookup for his correction language

### Operational layer (read these for HOW)

- **Atomic commit rule:** `~/.claude/rules/atomic-commit.md` — per-section commits at logical boundaries
- **Inspection links rule:** `~/.claude/rules/inspection-links.md` — preview URL surfacing after emission
- **Quality standard (self-verify + visual carve-out):** `~/.claude/rules/quality-standard.md` — evidence-before-done, three-viewport screenshot verification
- **Cascading change safety:** `~/.claude/rules/cascading-change-safety.md` — when changes to one customer page might affect sibling surfaces
- **Soft-phrasing imperative:** `~/.claude/agents/afco.md` § Soft phrasing → imperative intent — applies to Damian briefs especially

### Prior labs informing this mode

| Lab | What it contributes | Path |
|---|---|---|
| HOBA-grade per-customer content pipeline (2026-05-15) | Diagnostic + operator workflow framework that this mode operationalizes | `~/lab-reports/2026/anfragenfluss-kundenstimmen-cm2/2026-05-15-hoba-grade-per-customer-content-pipeline.md` |
| UI/UX improvements audit (2026-05-15) | Anti-pattern source (infinite pulse decoration); current-state audit input | `~/lab-reports/2026/anfragenfluss-kundenstimmen/2026-05-15-ui-ux-improvements-audit.md` |
| Perf audit (2026-05-15) | Image pipeline recommendations (AVIF, target sizes); CDN choice | `~/lab-reports/2026/anfragenfluss-kundenstimmen/2026-05-15-kundenstimmen-perf.md` |
| AFAI direction-finding (2026-05-16) | Architecture for cross-Claude consistency; mirror-prompt pattern (composable layer § 8.C) | `~/lab-reports/2026/afco-architecture/2026-05-16-afai-direction.md` |

---

## 10. How the generator consumes this

### At brief-writing time (Joe / Damian / Jonathan)

When sketching a new customer page:

1. **Open this doc** — read § 1-2 to refresh the mode definition
2. **Run the Designed Moment gate (§ 4 Step 2) per intended section** in your head before writing MDX
3. **Verify the data plan satisfies the hard gates (§ 5)** — especially Real-data and AFVQ-vocabulary
4. **Check the proposed composition against the anti-patterns (§ 6)** — concrete refusal list catches most violations at brief time, not at emission
5. **Check against the pre-mortem (§ 7)** — does this customer's data expose any of the 9 generator-level failure modes? If yes, surface to Joe/Damian before emit.
6. **Write the MDX file** — fill in the schema; the schema's required fields are the floor

### At runtime / build time (the generator code)

The `kundenstimmen-page` component's code is the executable layer of this doctrine. When extending the generator:

1. **Code changes must preserve the gates (§ 5)** — if a code change would make Real-data gate impossible to enforce (e.g., adding an "auto-fill placeholder" option), the change violates the mode and should be rejected
2. **Animation changes apply to all customers** — Lens 1 consistency rule; per af-werkschau lab Part C.1, motion is hard-coded for a reason
3. **New section types must define their FEEL/DO/REMEMBER** before being added to the schema — the Designed Moment gate fires at the SCHEMA level, not just at the data level
4. **New primitives go through the af-registry** — never invent inline in the generator. Add to `registry.json` first, then the generator can consume.
5. **Schema bumps follow the pre-mortem mitigations (§ 7.2 #3 + #8)** — new fields ALWAYS `optional?`; new media types require `schemaVersion` bump + registry primitive + migration note

### At review time (post-emission)

After a customer page emits and before declaring done:

1. **Round-Trip Screenshot Test** — three viewports, score each axis 0-100, rework until all ≥ 80 (per af-brand-doctrine § Round-Trip Screenshot Testing)
2. **Verify all hard gates passed (§ 5)** — seven-gate checklist; any fail blocks the "done" declaration
3. **Run the pre-mortem watch-signals (§ 7.2)** — scan for asset-missing overlays in prod-mode output, AFVQ vocabulary leaks, schema-version mismatches
4. **Surface inspection links** per `~/.claude/rules/inspection-links.md` — preview URL with the customer slug appended
5. **Document any conscious-divergence** — if a brand-canon rule was deliberately broken for THIS customer, the WHY lives in the commit body and (for material divergence) in a follow-up MDX comment

### For Damian's Claude sessions

When Damian's Claude works on an AF surface, this doc loads alongside the af-brand-doctrine skill (which auto-fires on AF surfaces per its own trigger contract). The mode operates the same — same lenses, same gates, same anti-patterns. The difference: Damian-mode unlocks the "1:1 nachbauen" cross-AF asset lift authority (per af-brand-doctrine § 5), which Joe doesn't carry.

**For preventing cross-Claude doctrine drift (pre-mortem failure mode #2):** Damian's Claude reads `~/.claude/personal/damian-context.md` Entry 1 in the same session that reads this doc. The audio transcript + this doc's § 7 + § 8 are the canonical anchor for "what Damian said about THIS generator."

### Versioning + change discipline

This doc is canonical. Changes require:

1. **Lens 1 changes** (brand canon, Damian's vocabulary, brand-rejected patterns) — Damian sign-off, then propagate to af-brand-doctrine skill, then update here
2. **Lens 2 changes** (EM principles, Designed Moment gate, peak-end discipline) — lab dispatch to validate against industry doctrine, then update here
3. **Lens 3 changes** (motion timing, animation primitives, accessibility floors) — industry-canon citation required, then update here
4. **Mode-procedure changes** (the 8-step walking procedure) — backwards-compatible by default; any breaking change requires per-customer migration plan
5. **Pre-mortem additions (§ 7)** — when a new failure mode is observed in production, add it to the inventory with mitigation + watch-signal; do not delete past entries even when mitigated (the audit trail matters)
6. **Future-expansion changes (§ 8)** — when a sibling generator ships, link its own MODES.md doc from § 8.A; when a per-customer mode ships, link it from § 8.B; when a composable layer ships, link it from § 8.C

Atomic commits per change (per `~/.claude/rules/atomic-commit.md`). Commit message documents the lens/section affected and the WHY.

---

## 11. The interface — inline AFCO chat (Joe directive 2026-05-17)

The operator interface for the generator is **inline AFCO chat**. The operator asks AFCO in chat (*"generate the HOBA Fallstudien"*), AFCO walks the 8-step procedure conversationally, emits artifacts inline (Step 4 mock-up as ASCII-art, Step 8 page as committed code), the operator approves or rejects at the Gate 7 checkpoint, AFCO commits the final code to git and pushes.

**Why this interface, not CLI / web UI / admin panel** (decided 2026-05-17): at solo-operator scale (≤25 customers per the af-werkschau lab Part C.2), inline-chat is the cheapest and fastest path to a customer page. Zero new infrastructure to build — no CLI scaffolding, no preview route, no admin panel. Composes with the AFCO + Claude Code workflow Joe already uses daily. Trade-off accepted: the mock-up is ephemeral (lives in the chat transcript only) unless explicitly persisted to disk; the audit trail is the git commit history rather than a formal approval log.

**Graduation signals to a heavier interface** (any one fires the re-evaluation):
- 25+ customers — makes admin-panel build justified per af-werkschau lab Part C.2
- Non-developer needs to add customers without touching git (assistant role, VA, sales team)
- Damian wants to add customers from his own machine without an AFCO session running
- Mock-up audit history becomes load-bearing (regulatory, governance, multi-stakeholder approval)

Until any of those fire, inline AFCO chat is the interface.

### The chat invocation shape

```
Joe / Damian:  "Generate the HOBA Fallstudien using the doctrine."

AFCO:
  Step 1 — Parse data + validate schema                    [internal]
  Step 2 — Designed Moment gate per section                [internal]
  Step 3 — Pick primitives from registry (tentative)       [internal]
  Step 4 — Emit structural mock-up                         [VISIBLE in chat]

Joe / Damian:  "Approved" | "Revise section X" | "Restructure entirely"

AFCO (if approved):
  Step 5 — Compose motion (Lens 3 timing canon)            [internal]
  Step 6 — Web-design hygiene pass                          [internal]
  Step 7 — Brand-canon checks                               [internal]
  Step 8 — Emit page code + atomic commits + push           [VISIBLE: commit URLs]

AFCO surfaces: commit SHA + GitHub commit URL + Vercel preview URL + Round-Trip
Screenshot Test scores per viewport.
```

### Persistence opt-in for mock-ups

By default, the Step 4 mock-up lives only in the chat transcript (ephemeral — disappears with the session). If the operator wants it persisted for audit / reference / future iteration, they say so at approval time. Canonical home: `~/Projects/af-registry/mocks/<YYYY-MM-DD>-<customer-slug>-step4.md` (co-located with the doctrine doc). Format: the ASCII art + a short metadata header naming customer, generator type, date, approval status.

### Composition with other rules

- `feedback_research_presentation_style.md` § Walkthrough-section shape — Step 4 mock-up emission follows the shape exactly (substantive context + visual spacing + recap + picker for approve/revise/restructure)
- `~/.claude/rules/atomic-commit.md` — Step 8 emits atomic commits per logical boundary (per-section commits when the page is built up in stages)
- `~/.claude/rules/inspection-links.md` — Step 8 surfaces the preview URL after deploy, per the "🔗 See it live now" headline rule
- `~/.claude/rules/ntfy-notifications.md` — long-running Step 8 commits + deploy (>2 min wall-clock) fires an ntfy ping when complete

### Dry-run validation (2026-05-17)

The inline-chat interface was dry-run end-to-end on the HOBA Fallstudien page on the night of 2026-05-17. Steps 1-4 executed; Step 4 mock-up emitted; operator approved at Gate 7. Steps 5-8 deferred to a fresh-eyes session per fatigue. The dry-run validated that the interface works without new infrastructure and that the operator review loop at Gate 7 is the right place for the approve/reject decision. Reference incident: this session's chat transcript.

---

## Status + open questions

**Status (2026-05-17):** v1.3. Default Anfragenfluss Mode defined (§§ 1-6). Pre-mortem inventory (§ 7). Future expansion sketched in three groups (§ 8). Operator interface settled in § 11 (inline AFCO chat, per Joe directive 2026-05-17 — graduation signals to CLI / admin-UI named). v1.3 adds § 11 after the HOBA Fallstudien dry-run validated the inline-chat shape end-to-end. v1.2 added Step 4 (structural mock-up emission) + Gate 7 (mock-up reviewed before emit) per Joe directive 2026-05-17 (image-driven addition: the generator should produce an ASCII layout sketch BEFORE actually building the page). v1.1 incorporated Damian's Holbeinstraße directive (anticipatory thinking + pre-mortem framing). v1.0 was the first draft without that input.

**Open questions for Joe + Damian:**

1. **Mode-naming convention for § 8.B per-customer modes** — by industry (`HOBA Solar Mode`) or by AF-segment (`PV-Mode`, `SHK-Mode`)? The former is more specific but loses reuse; the latter generalizes but may mis-fit specific customers.
2. **Whether the Filter Quiz section is in scope for the kundenstimmen generator** — currently `KundenstimmenPageData` doesn't include Filter Quiz config. Adding it would extend the schema; the canon section ordering says Quiz comes between Hero and Events, but no customer has needed it customized yet.
3. **Which sibling generator (§ 8.A) gets built first after kundenstimmen proves out** — Fallstudien is the closest sibling and would reuse the most; Marketing Landing is the highest-leverage for customer acquisition; Job Listing is the most internal but tied to existing AFJC work. Order matters because the second generator validates whether the doctrine actually generalizes.

**Resolved by v1.1 (previously open in v1.0):**
- ~~Where customer modes live when v2 hits~~ — Resolved: separate files in `~/Projects/af-registry/modes/<mode-name>.md`; this doc becomes the index. § 8 names this explicitly.
- ~~Whether non-customer-facing surfaces get their own "Anfragenfluss Internal Mode"~~ — Resolved: yes, but as a Freigabe-Portal Generator (§ 8.A) — distinct generator with its own MODES.md, not an override mode within kundenstimmen.

**Held for later (post-v2):**

- Exit animations (SwipeOut, FadeOut) — relevant if the generator extends to page transitions or interactive demos
- A/B-testable motion variants — relevant at 50+ customers
- Non-developer admin panel for MDX writing — relevant at 25+ customers per the af-werkschau lab Part C.2
- The composable layers in § 8.C — each one earns its keep at a specific scale or workflow trigger; not before

---

**END OF DOC**
