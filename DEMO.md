# Demo guide — Meridian University Open Search

**Live link:** https://uxpreview.github.io/open-search-university/

A prototype of an AI site-search experience for a prospective student. A few
paths are fully built out; everything else is clickable but intentionally does
nothing, so you never land on an off-topic screen mid-demo. Stick to the paths
below and lead with **typing real questions into the search** — that's the story.

> Tip: if anything looks out of date, hard-refresh (Cmd+Shift+R / Ctrl+F5).

---

## Opening the search

From the homepage: click **Search** in the nav, click the **hero search bar**,
or press **⌘K** (Mac) / **Ctrl K** (Windows). Type a question and press
**Enter** to run it.

---

## Flow 1 — Cost & aid (type a real question)

The headline moment: a prospective student just types what's on their mind.

**Do this:** open search and type, e.g.
> *"How much will it cost to attend and what financial aid can I get?"*

Press **Enter**. (Other phrasings work too — "tuition", "scholarships",
"can I afford Meridian", "net price".)

**Show:** the streamed answer with citations, the cost breakdown + net-price
callout, the **sample aid package** card, the **how aid works** steps, and the
scholarships list. Try a follow-up chip at the bottom.

## Flow 2 — Compare two programs

A student torn between two majors.

**Do this:** open search and type
> *"Compare Computer Science and Data Science"*

Press **Enter**. ("Computer Science vs Data Science" also works, and it's in
the **Recent** list as "CS vs Data Science" if you want a one-click backup.)

**Show:** the **side-by-side comparison table**, the "how they overlap" and
"how to choose" sections, and the **Explore Computer Science** button (opens the
full CS program flow).

## Flow 3 — Use the tabs to narrow the result type

Show how the scope tabs above the search hone in on one kind of result.

**Do this:** open search, click the **Faculty** tab above the box, then type
> *"computer science"*

and pick **Computer Science faculty** (or press Enter). The answer opens
straight to the **Faculty** view — just the professor cards. Click the other
tabs (**Programs / Campus**) to show the same answer re-sliced by result type.

> Other tabs work the same way for Computer Science (try **Programs** →
> "computer science" to land on courses + related programs).

## Bonus — Degree Planner (guided agent)

**Do this:** in the search modal sidebar, click **Degree Planner**. A 3-step
wizard (Interest → Level → Format). Pick **Engineering & Computing → Bachelor's
→ On-campus**; on the **Computer Science** result card, **Explore** opens Flow 2's
program. (Other result cards are placeholders — see below.)

---

## Suggested 2-minute script

1. Homepage → **⌘K**.
2. Type **"How much will it cost and what financial aid can I get?"** → Enter.
   Walk the cost breakdown + aid package.
3. **New chat** (sidebar) → type **"Compare Computer Science and Data Science"**
   → Enter. Walk the comparison table, then click **Explore Computer Science**.
4. **New chat** → click the **Faculty** tab → type **"computer science"** →
   open **Computer Science faculty**. Point out it landed on the Faculty view;
   click **Programs** / **Campus** to re-slice.

---

## What's intentionally inert (don't click in the demo)

Styled to look clickable but do nothing, by design:
- **Sidebar agents** except Degree Planner — **Virtual Advisor**, **Financial
  Aid Assistant**, **Career Dreamer**, **Visit Planner** are placeholders.
- Majors other than Computer Science / Data Science, and unrelated searches
  (admissions, housing, dining, visit, other faculty).
- "Related program" cards, and "Explore" on non-CS Degree Planner results.
- Homepage nav links and most footer links.

If you type a question we haven't built (e.g. "How do I apply?"), nothing
happens — that's expected; it won't show an unrelated answer.
