# Product

## Register

product

## Users

Two audiences, and they pull in different directions.

**In the fiction:** prospective students (plus parents, current students, counselors) landing on a university site with a specific question — is there a program for me, what does it cost, can I afford it, who teaches it. Anxious, comparison-shopping across schools, often on a phone, rarely willing to click through five levels of site nav. The job: get a trustworthy, cited answer without learning the institution's org chart.

**In reality:** higher-ed marketing and admissions stakeholders watching a live pitch. They are judging whether an AI search layer can sit on a university site without embarrassing the institution. They notice broken hover states, misaligned rails, and answers that look invented.

## Product Purpose

A working demo of an AI-powered site-search experience for a university, used as a new-business artifact for higher-ed prospects. It shows the interaction model: a search modal over the existing site, typeahead + scope tabs, streaming cited answers, program comparison, and a guided Degree Planner agent.

Success is a demo that survives scrutiny in the room — every path a presenter touches behaves, and the interface looks like a considered institutional product rather than a generated template. The demo sells the pattern; sloppiness in the demo sells doubt.

Meridian University is fictional and every figure is illustrative. Facts stay consistent with `BRAND.md` so the demo never contradicts itself on stage.

## Brand Personality

Warm, encouraging, factual — the voice from `BRAND.md`, unchanged. Admissions-friendly copy: second person, plain language, no jargon, no hard sell. Numbers stated flatly and cited rather than dressed up. Encouragement lives in the writing, not in exclamation marks or celebration UI.

Institutional confidence without pomp. It should read like a university that answers the question you actually asked.

## Anti-references

- **Warm-paper / cream near-white body backgrounds.** The current `#F7F5F0` paper surface is the saturated AI-generated default. The identity moves to a committed color strategy: a saturated institutional surface (deep navy end of Meridian's own palette) carrying 30–60% of the page, with warmth carried by accent, typography and imagery instead of a beige body.
- **Chatbot skin.** Not a floating purple bubble, not a widget bolted to the corner, not gradient-on-dark assistant styling.
- **SaaS landing conventions on an institutional site.** No hero-metric template, no tiny tracked uppercase eyebrow above every section, no identical icon-heading-text card grids.
- **Brochure gloss.** Stock smiling-students-on-a-quad framing, superlatives, and "unlock your potential" copy.
- **Invented authority.** Answers must show sources; nothing may look confidently made up.

## Design Principles

1. **The answer is the product.** Chrome, rails and agents exist to deliver a cited answer fast. Anything that competes with the answer loses.
2. **Cite or don't claim.** Every figure traces to a source affordance. Trust is the whole pitch.
3. **Demo-path integrity.** The paths a presenter walks must be flawless before any new surface is added. A visible bug costs more than a missing feature.
4. **Institution, not assistant.** Visual language belongs to a university product: committed color, real typographic hierarchy, restraint. No assistant-widget tropes.
5. **Consistent fiction.** Programs, costs, colleges and names match `BRAND.md` everywhere, so scrutiny finds coherence instead of contradiction.

## Accessibility & Inclusion

Demo-grade. Contrast and keyboard operability hold on the paths a demo touches: body text ≥4.5:1, visible focus on modal triggers, rail items, composer and agent steps; ⌘K / Esc / Tab behave. `prefers-reduced-motion` respected for streaming and reveal motion.

No full WCAG audit or VPAT claim is in scope, and none should be asserted in a pitch. If a prospect asks for a conformance commitment, that is a separate hardening pass (`/impeccable harden`).
