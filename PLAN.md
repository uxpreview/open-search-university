# Meridian University — Open Search (Higher-Ed re-theme)

A re-theme of an AI-search-modal demo (originally "Meridian Health") into a
university prospective-student experience. No build step: in-browser React +
Babel standalone, deployed as static files to GitHub Pages.

## Scope (as agreed)
Core functionality + **two chat-answer flows** + **one Program Finder agent**.
Not a full build-out of every screen.

## What's included
- **Site shell** — Meridian University home page + a contextual Computer Science
  program page. ⌘K / click opens the AI search modal.
- **Modal core** — landing, typeahead search index, scopes (Ask / Programs /
  Faculty / Campus / Pages), role selector (Prospective student / Current
  student / Parent), streaming answers, citations, follow-ups.
- **Chat flow A — Explore a major:** "Tell me about the Computer Science major"
  → overview, faculty, sample courses, outcomes, campus, related programs.
- **Chat flow B — Cost, aid & scholarships:** "How much does Meridian cost and
  what aid can I get?" → cost breakdown, how-aid-works steps, scholarships,
  financial-aid office, FAQ.
- **Program Finder agent** — 3-step wizard (interest → degree level → format)
  that returns matched programs and hands off into the Explore-a-major answer.

## Architecture (unchanged from source)
`index.html` loads React/Babel UMD + the `.jsx` files. `data.jsx` holds the
answer templates (`window.AlmaData`); `app.jsx` resolves a typed query to a
template via `resolveAnswer()` and streams it. Agents are stepper components
rendered from `App()` state.

## Brand
Fictional **Meridian University**. Collegiate palette: deep navy + gold on warm
paper; serif display (Source Serif 4).

## Deploy
Asset paths are relative (GitHub Pages project subpath). Public repo
`uxpreview/open-search-university`, served from GitHub Pages.
