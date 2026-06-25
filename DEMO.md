# Demo guide — Meridian University Open Search

**Live link:** https://uxpreview.github.io/open-search-university/

A prototype of an AI site-search experience for a university. Three flows are
fully built out; everything else is clickable but intentionally does nothing
(so you never land on an off-topic screen mid-demo). Stick to the paths below.

> Tip: if anything looks out of date, hard-refresh (Cmd+Shift+R / Ctrl+F5).

---

## Opening the search

From the homepage, open the search modal any of these ways:
- Click **Search** in the top nav
- Click the big **search bar** in the hero
- Press **⌘K** (Mac) or **Ctrl K** (Windows)

Inside the modal, the fastest way to launch a flow is the **left sidebar** —
items under **AGENTS** and **RECENT** run on a single click. (The centered
suggestions under the search box *fill* the box instead; press **Enter** to run
them.)

---

## Flow 1 — Explore a major (Computer Science)

**Launch:** sidebar → **Explore majors** (or type "Tell me about the Computer
Science major" and press Enter, or click the **Computer Science major** recent).

**What to show:** the answer streams in, then reveals sections. Point out:
- The **summary** with footnote citations
- **Apply now** / **View program page** buttons under the summary
  (View program page opens the dedicated Computer Science page)
- The scope tabs up top — **Programs / Faculty / Campus** — click through them
- The **faculty** and **campus** cards, the **Related programs** cards
- The **"you can also ask"** follow-up chips at the bottom (these work — try
  "Who teaches in the CS department?")

## Flow 2 — Cost, aid & scholarships

**Launch:** sidebar → **Cost & aid** (or **Scholarships**, or type "How much
does Meridian cost and what aid can I get?" and press Enter).

**What to show:**
- Cost breakdown ("What it actually costs") and the **net-price** callout
- **A sample aid package** card
- **How aid works** step-by-step
- **Scholarships** list and the financial-aid office card
- Follow-up chips work here too (e.g. "What scholarships am I eligible for?")

## Flow 3 — Program Finder (guided agent)

**Launch:** sidebar → **Program Finder**.

**What to show:** a 3-step wizard — **Interest → Level → Format**. Pick any
options to reach the results. For the cleanest hand-off, choose
**Engineering & Computing**, then **Bachelor's**, then **On-campus**:
- You get matched program cards (Computer Science, Data Science, Cybersecurity)
- On the **Computer Science** card, **Explore** opens the full CS answer (Flow 1)
- **Cost & aid** on any card opens Flow 2

> Note: "Explore" only opens an answer for **Computer Science**. For other
> programs it does nothing on purpose (no full answer is built for them).

---

## Recommended 2-minute script

1. Land on the homepage, press **⌘K** to open search.
2. Sidebar → **Program Finder** → Engineering & Computing → Bachelor's →
   On-campus → on the Computer Science card click **Explore**.
3. In the CS answer, click through the **Programs / Faculty / Campus** tabs and
   the **View program page** button.
4. Back to search (**New chat** in the sidebar), sidebar → **Cost & aid** to
   show the aid breakdown and sample package.

---

## What's intentionally inert (skip these in the demo)

These are styled to look clickable but do nothing, by design:
- Other majors (Nursing, Business, Psychology, etc.) and other faculty/campus
  searches
- Admissions / housing / dining / visit suggestions and typeahead results
- "Related program" cards, and "Explore" on non-CS Program Finder results
- Homepage nav links and most footer links

If you type a question we haven't built (e.g. "How do I apply?") nothing
happens — that's expected; it just won't show an unrelated answer.
