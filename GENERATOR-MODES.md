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

### Step 4 — Compose motion at the right register (Lens 3 + Lens 1)

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

### Step 5 — Run the web-design hygiene pass (Lens 3)

Before emission, the mode checks:

- **Three viewports** — 375 / 768 / 1280 px layouts hold. No horizontal scroll at 375. No clipped text. All touch targets ≥ 44×44pt.
- **Typography** — brand fonts loaded; no AI-default serif/sans drift; letter-spacing + line-height per af-tokens
- **Color** — only AF palette tokens; no generic AI gradient backgrounds (the purple-to-pink tells)
- **Copy** — passes humanizer rubric (no em-dash overuse, no rule-of-three triplets, no title-case section headings, no "significance inflation"); German-first on AF customer-facing surfaces
- **Layout** — asymmetry where deliberate; NOT the AI-cliché (Hero / 3-cols / centered-CTA / 4-step-process / footer pattern)

### Step 6 — Run the brand-canon checks (Lens 1)

Before emission, the mode confirms:

- **Section ordering** matches Experience-Page canon (Hero → Filter quiz where present → Events → Customer cards), narrative not categorical
- **AFVQ vocabulary** — never "Testimonial," never "Review," always AFVQ or *Kundenstimme* in German
- **Real data only** — every visible content element traces to a real customer / asset / value. Missing assets surface as "ASSET MISSING" not as fabricated placeholder.
- **No rejected patterns** — no three-pill badges, no auto-play with sound, no infinite decorative animations
- **Damian's vocabulary applied** — "richtig clean" tightening on chrome; "abwechselnd" on AFVQ rows; "mittig zum handy" on adjacent elements; "knallen" register only where the section earns the visual weight

### Step 7 — Emit the page + write the verification trail

The component renders. A `git commit` lands with:

- Atomic per-section commits when the page is built up in stages (per `~/.claude/rules/atomic-commit.md`)
- Commit body documents any cross-AF asset lifts ("hero cloned from zusammenarbeit per Damian-mode lift authority")
- After emission, the Playwright round-trip screenshot test fires at three viewports (per af-brand-doctrine § Round-Trip Screenshot Testing): typography / color / layout / copy / mobile / tablet / desktop each scored 0-100; rework any axis < 80; repeat until all ≥ 80.

---

## 5. The hard gates (non-negotiable)

These six checks BLOCK emission. They are not "warnings." A page that fails any one of them is not emitted under Anfragenfluss Mode.

| # | Gate | What it checks | What blocks emission |
|---|---|---|---|
| 1 | **Designed Moment** | FEEL / DO / REMEMBER on every section | Any section without specific answer on any axis |
| 2 | **Wahre Stimmen / Real-data** | Every visible content element traces to a real customer | Any placeholder, fabricated quote, stock photo, or `customer_name = "Customer A"` |
| 3 | **AFVQ vocabulary** | Pull quotes labeled correctly | Any "Testimonial," "Review," or generic-marketing-vocab leak |
| 4 | **`prefers-reduced-motion`** | All four animation primitives gate translation + overshoot | Any primitive that animates unconditionally regardless of preference |
| 5 | **Three-viewport responsive** | 375 / 768 / 1280 px hold | Horizontal scroll, clipped text, broken layout, sub-44pt touch targets at any viewport |
| 6 | **Brand-rejected patterns absent** | Three-pill badges / auto-play-with-sound / infinite-decoration loops | Any of the named rejected patterns from af-brand-doctrine § anti-patterns |

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

## 7. Future modes — per-customer mode expansion path

Anfragenfluss Mode is the default. Customer-specific modes are sketched here as v2 territory. The expansion path is open but not built.

### What a per-customer mode WOULD do

A customer-specific mode would wrap Anfragenfluss Mode and override specific decisions for THIS customer's aesthetic and voice. Example modes:

- **HOBA Solar Mode** — industrial PV vocabulary, dark color register dominance, technical-credibility-forward copy (sizing data, conversion math, GF-direct quotes)
- **Roofing Mode** — local-trade vocabulary, warm color register, peer-trust-forward copy (Innungs-Kollege endorsements, fast-response stories)
- **SHK Mode** — Sanitär-Heizung-Klima vocabulary, family-business-trust register, multi-generational-story copy
- **Industrial-B2B Mode** — formal vocabulary, gray-blue register, decision-committee-friendly copy (procurement-vetted, ROI-explicit)

### Why this is v2 territory, not v1

- **Default consistency wins at 10-25 customers.** Per the af-werkschau lab Part C.1, consistency over flexibility serves brand quality at current scale.
- **Per-customer modes add tuning surface per customer.** This violates the 8-12 minute onboarding goal until a mode is reusable across multiple customers.
- **The empirical justification doesn't exist yet.** AFCO doesn't know which customer-segments cluster enough to warrant distinct modes. That's a question for the customer-base at scale, not the first 5 customers.

### When to graduate from default Mode to per-customer Modes

| Threshold | Signal | Action |
|---|---|---|
| **3-5 customers in one segment** | E.g., 3 PV customers, 3 SHK customers, 3 roofers | Audit whether their pages would benefit from distinct register; if yes, draft the first per-customer mode |
| **Damian asks for it** | Manual brief signals like *"die HOBA Seite fühlt sich anders an als die Volt-On-Seite — passt das?"* | The brief IS the trigger; draft the mode from his correction vocabulary |
| **A customer explicitly requests a different aesthetic** | E.g., a customer says their brand register conflicts with AF default | Mode-fork as the response, not an inline override |

### How per-customer modes WOULD compose with Anfragenfluss Mode

The mode hierarchy would be **inherit + override**, not replace:

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
- The 6 hard gates (Designed Moment, Real-data, AFVQ vocab, `prefers-reduced-motion`, three-viewport, brand-rejected patterns)
- The 3-lens composition order
- The af-tokens palette (only EMPHASIS within it)
- The registry primitives (can only choose among them, not invent new ones inline)

This keeps brand-grade consistency while permitting per-segment voice.

---

## 8. Cross-references

### Doctrine sources (read these for deep WHY)

- **AF brand canon (Lens 1 — WHY/RULES):** `~/.claude/skills/af-brand-doctrine/SKILL.md` — 8 brand-grade patterns, Damian-mode detection, Damian's vocabulary, Round-Trip Screenshot Testing
- **AF design choices (Lens 1 — WHAT/CHOICES):** `~/.claude/skills/af-design-catalog/SKILL.md` — named aesthetic anchors, color palettes, font pairings, operational tooling per EM layer
- **Experience Marketing doctrine (Lens 2):** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-experience-marketing-doctrine.md` — 8 principles, Coca-Cola Freestyle worked example, Pine & Gilmore / Schmitt / Holt / Sutherland citations
- **Design resources scan (Lens 3 — WHAT):** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-design-skills-scan.md` — 54 vetted resources, top-5 adoption shortlist (Lenis, Tailwind v4 + OKLCH, shadcn MCP, Radix Primitives, Geist)
- **AF Werkschau effects + architecture (Lens 3 — HOW):** `~/lab-reports/2026/af-werkschau/2026-05-16-effects-best-practices-and-generator-architecture.md` — timing curves, stagger choreography, `will-change` hygiene, `prefers-reduced-motion` discipline, scroll-reveal tuning, MDX-in-repo decision
- **Frontend design skill (Lens 3 — discipline):** `~/.claude/skills/frontend-design/SKILL.md` — anti-AI-slop, distinctive aesthetics, production-grade output

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
| AFAI direction-finding (2026-05-16) | Architecture for cross-Claude consistency; mirror-prompt pattern | `~/lab-reports/2026/afco-architecture/2026-05-16-afai-direction.md` |

---

## 9. How the generator consumes this

### At brief-writing time (Joe / Damian / Jonathan)

When sketching a new customer page:

1. **Open this doc** — read § 1-2 to refresh the mode definition
2. **Run the Designed Moment gate (§ 4 Step 2) per intended section** in your head before writing MDX
3. **Verify the data plan satisfies the hard gates (§ 5)** — especially Real-data and AFVQ-vocabulary
4. **Check the proposed composition against the anti-patterns (§ 6)** — concrete refusal list catches most violations at brief time, not at emission
5. **Write the MDX file** — fill in the schema; the schema's required fields are the floor

### At runtime / build time (the generator code)

The `kundenstimmen-page` component's code is the executable layer of this doctrine. When extending the generator:

1. **Code changes must preserve the gates** — if a code change would make Real-data gate impossible to enforce (e.g., adding an "auto-fill placeholder" option), the change violates the mode and should be rejected
2. **Animation changes apply to all customers** — Lens 1 consistency rule; per af-werkschau lab Part C.1, motion is hard-coded for a reason
3. **New section types must define their FEEL/DO/REMEMBER** before being added to the schema — the Designed Moment gate fires at the SCHEMA level, not just at the data level
4. **New primitives go through the af-registry** — never invent inline in the generator. Add to `registry.json` first, then the generator can consume.

### At review time (post-emission)

After a customer page emits and before declaring done:

1. **Round-Trip Screenshot Test** — three viewports, score each axis 0-100, rework until all ≥ 80 (per af-brand-doctrine § Round-Trip Screenshot Testing)
2. **Verify all hard gates passed** — six-gate checklist; any fail blocks the "done" declaration
3. **Surface inspection links** per `~/.claude/rules/inspection-links.md` — preview URL with the customer slug appended
4. **Document any conscious-divergence** — if a brand-canon rule was deliberately broken for THIS customer, the WHY lives in the commit body and (for material divergence) in a follow-up MDX comment

### For Damian's Claude sessions

When Damian's Claude works on an AF surface, this doc loads alongside the af-brand-doctrine skill (which auto-fires on AF surfaces per its own trigger contract). The mode operates the same — same lenses, same gates, same anti-patterns. The difference: Damian-mode unlocks the "1:1 nachbauen" cross-AF asset lift authority (per af-brand-doctrine § 5), which Joe doesn't carry.

### Versioning + change discipline

This doc is canonical. Changes require:

1. **Lens 1 changes** (brand canon, Damian's vocabulary, brand-rejected patterns) — Damian sign-off, then propagate to af-brand-doctrine skill, then update here
2. **Lens 2 changes** (EM principles, Designed Moment gate, peak-end discipline) — lab dispatch to validate against industry doctrine, then update here
3. **Lens 3 changes** (motion timing, animation primitives, accessibility floors) — industry-canon citation required, then update here
4. **Mode-procedure changes** (the 7-step walking procedure) — backwards-compatible by default; any breaking change requires per-customer migration plan

Atomic commits per change (per `~/.claude/rules/atomic-commit.md`). Commit message documents the lens affected and the WHY.

---

## Status + open questions

**Status (2026-05-17):** v1.0. Default Anfragenfluss Mode defined. Per-customer modes sketched in § 7 as v2 territory.

**Open questions for Joe + Damian:**

1. **Mode-naming convention** — should per-customer modes be named by industry (`HOBA Solar Mode`) or by AF-segment (`PV-Mode`, `SHK-Mode`)? The former is more specific but loses reuse; the latter generalizes but may mis-fit specific customers.
2. **Where customer modes live when v2 hits** — separate files in `~/Projects/af-registry/modes/<mode-name>.md`? Or extension to this doc? Recommendation: separate files; this doc becomes the index.
3. **Whether non-customer-facing surfaces (ACAT, anfragenfluss.cloud, fulfillment-app) get their own "Anfragenfluss Internal Mode"** — different aesthetic register (per af-design-catalog Internal-Tool anchor) but same brand canon. Currently those surfaces are governed by af-brand-doctrine § "vocabulary + composition + motion-discipline only" carve-out. A separate mode might formalize the distinction.
4. **Whether the Filter Quiz section is in scope for this generator** — currently `KundenstimmenPageData` doesn't include Filter Quiz config. Adding it would extend the schema; the canon section ordering says Quiz comes between Hero and Events, but no customer has needed it customized yet.

**Held for later:**

- Exit animations (SwipeOut, FadeOut) — relevant if the generator extends to page transitions or interactive demos
- A/B-testable motion variants — relevant at 50+ customers
- Non-developer admin panel for MDX writing — relevant at 25+ customers per the af-werkschau lab Part C.2

---

**END OF DOC**
