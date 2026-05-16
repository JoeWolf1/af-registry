# af-registry

AF (Anfragenfluss) canonical brand-grade components, installable via the shadcn CLI from any project.

**The shape:** AF doctrine + catalog live as markdown documentation (`~/.claude/skills/af-brand-doctrine` + `~/.claude/skills/af-design-catalog`); AF canonical components live HERE as installable code. Same canon, two artifacts — docs for reading, registry for shipping.

---

## Install

You need the [shadcn CLI](https://ui.shadcn.com/docs/cli). In any project (Next.js + Tailwind):

```bash
# Initialize shadcn if not already done
npx shadcn@latest init

# 1. Install AF tokens (always install first — components depend on these)
npx shadcn@latest add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/af-tokens.json

# 2. Install components as needed
npx shadcn@latest add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/afvq-card-unified.json
npx shadcn@latest add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/iphone-chassis.json
npx shadcn@latest add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/three-phase-iphone-hero.json
```

Components declare their `registryDependencies` — installing `three-phase-iphone-hero` automatically pulls in `iphone-chassis` and `af-tokens`.

Then import the tokens in your global stylesheet (`app/globals.css` or equivalent):

```css
@import "./styles/af-tokens.css";
```

---

## Available components

| Name | Type | Status | Doctrine reference |
|---|---|---|---|
| `af-tokens` | style | `[canon-confirmed]` for base 4 tokens; `[canon-inferred]` for derivatives | `af-design-catalog/palettes/ink-paper-pulse.md` |
| `afvq-card-unified` | component | `[canon-confirmed]` pattern; `[canon-inferred]` exact opacity stops | `af-brand-doctrine § 6. AFVQ-card-unified` |
| `iphone-chassis` | component | `[canon-inferred]` chassis structure; `[damian-canon-needed]` exact dimensions | `af-brand-doctrine § 2` + `~/Anfragenfluss-style/audits/iphone-as-content-vehicle.md` |
| `three-phase-iphone-hero` | component | `[canon-confirmed]` pattern (3-phase narrative arc); `[canon-inferred]` scroll-pivot implementation | `af-brand-doctrine § 2. Three-phase iPhone hero` |

More components are queued for extraction; see `~/.claude/skills/af-design-catalog/MUTATION.md § shadcn registry path` for the canonical order.

**Before using iPhone-based components on a real AF surface:** the `preflight-device-mock` skill MUST fire (brand-wide rule). The chassis ships as a generic device-frame; the preflight enforces correct dimensions, content fit, and realistic rendering for the specific use.

---

## Usage example — AFVQ Card

```tsx
import { AfvqCardUnified } from '@/components/af/afvq-card-unified';

export default function KundenstimmenSection() {
  return (
    <div className="grid gap-8">
      <AfvqCardUnified
        customerName="Hans Bauer"
        customerCompany="HOBA Energietechnik GmbH"
        quote="Anfragenfluss hat unsere Lead-Pipeline transformiert — jetzt kommen die richtigen Kunden zu uns."
        videoSrc="/videos/hoba-testimonial.mp4"
        posterSrc="/videos/hoba-testimonial-poster.jpg"
        variant="left-text"
      />
      <AfvqCardUnified
        customerName="Maria Schneider"
        customerCompany="Schneider Sanitär GmbH"
        quote="Die WhatsApp-Übergaben sind das wertvollste Feature für unser Team."
        videoSrc="/videos/schneider-testimonial.mp4"
        posterSrc="/videos/schneider-testimonial-poster.jpg"
        variant="right-text"
      />
    </div>
  );
}
```

The `variant` prop alternates text/video order per row — Damian's *"abwechselnd"* directive operationalized.

---

## Usage example — Three-Phase iPhone Hero

```tsx
import { ThreePhaseIphoneHero } from '@/components/af/three-phase-iphone-hero';

export default function ExperiencePage() {
  return (
    <section className="py-24">
      <ThreePhaseIphoneHero
        // Phase 1: documentary evidence — real customer artifact, active state
        phase1={<WhatsAppChatMessages messages={hobaMessages} />}

        // Phase 2: fourth-wall splash — pivot question to the visitor
        phase2="Wann bist DU dran?"

        // Phase 3: future-self projection — different medium, same person's outcome
        phase3={<ReelsFeed campaign="hoba-lead-pipeline" />}

        caption="Hans Bauer — HOBA Energietechnik"
        size="hero"
        pinned
      />
    </section>
  );
}
```

Rules per `af-brand-doctrine § 2`:
- Use 3 DIFFERENT mediums across phases (not 3 screens of the same app)
- All phases must be REAL artifacts (placeholder content fails the bar)
- Run `preflight-device-mock` skill before declaring done

---

## Anti-patterns

What this registry refuses to ship:

- **Three-pill badges** (Sofort / Proaktiv / Langfristig on the AFVQ card) — Damian rejected as *"zu schwammig"*
- **Auto-play with sound on page load** — click-to-play with sound is the canon
- **Placeholder content** — every shipped instance MUST trace to a real customer
- **Generic "menu of everything"** — this is the AF canon, not a kitchen sink

If a component request would violate any of these, the request gets rejected at registry-mutation review.

---

## Mutation discipline

This registry follows the same mutation rules as `~/.claude/skills/af-design-catalog/MUTATION.md`:

1. **Curated base only** — every component traces to Damian-stated canon, Joe-confirmed default, or doctrine-derived inference
2. **AF-mutated, never copied** — external patterns get mutated to AF-form before entering the registry
3. **Confidence-tagged** — entries carry `[canon-confirmed]` / `[canon-inferred]` / `[joe-proxy]` / `[damian-canon-needed]` status
4. **One component at a time** — incremental additions; no bulk imports
5. **Versioning** — semver. Patch for bugfix, minor for additive change, major for breaking change to the component API

---

## Cross-references

- **Doctrine (WHY/RULES):** `~/.claude/skills/af-brand-doctrine/SKILL.md`
- **Catalog (WHAT/CHOICES):** `~/.claude/skills/af-design-catalog/SKILL.md`
- **Mutation rules:** `~/.claude/skills/af-design-catalog/MUTATION.md`
- **Origin lab report:** `~/lab-reports/2026/anfragenfluss-style/2026-05-16-design-skills-scan.md`
- **Anthropic structural analog:** `github.com/anthropics/skills/tree/main/skills/brand-guidelines`

---

## License

UNLICENSED — AF brand canon. Not for general redistribution. Internal use by Joe + Damian + AF collaborators only; if you found this and aren't AF, please don't use it.
