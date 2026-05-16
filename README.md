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

# 2. Install AFVQ Card (Unified)
npx shadcn@latest add https://raw.githubusercontent.com/JoeWolf1/af-registry/main/public/r/afvq-card-unified.json
```

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

More components are queued for extraction; see `~/.claude/skills/af-design-catalog/MUTATION.md § shadcn registry path` for the canonical order.

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
