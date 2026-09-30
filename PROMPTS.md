# Prompt Log

This file logs each build instruction given to Claude and a short note on what was built in response, so the development process is visible for review.

---

## 2026-09-29 — M0: Scaffold

**Prompt:** Set up the OpenRaiz project. Approved plan: a static HTML/CSS/JS job board for young adults with lived experience of systemic barriers, built one milestone at a time. Folder lives at `~/Next_Chapter_HCM/openraiz`, next to `first-controlled-build`.

**What was built:** Created the project folder and subfolders (`css/`, `js/`, `data/`, `docs/`, `assets/`). Started this `PROMPTS.md` log. Full plan (milestones, JSON schema, brand/language guardrails) is recorded separately for reference.

**Next milestone:** M1 — static page shell (`index.html`) and placeholder branding in `css/styles.css`.

---

## 2026-09-29 — M1: Static page shell + placeholder branding

**Prompt series:** Build the M1 shell; add comments explaining every code chunk (standing instruction for this project); explore a visual concept for the header/hero via a design mockup (centered logo lockup, feather icon, pill nav, gradient accent underline); approve that look and bring it into the real site.

**What was built:**
- `index.html`: page skeleton with header (centered feather-icon + "OpenRaíz" wordmark, centered pill nav with an active-state indicator, small gradient accent underline), a centered hero section, empty placeholder sections for filters (M5) and the opportunity grid (M3), and a footer crediting "Incubated by Alianza for Opportunity."
- `css/styles.css`: placeholder brand variables (green/orange/cream palette, system fonts), mobile-first base layout, the centered header/nav/hero styling described above, and a responsive 1→2→3 column grid for the future opportunity cards.
- Every section of both files is commented per the project's standing comment rule.
- A separate visual-concept mockup (desktop + phone, including a scroll-triggered fade-in effect for cards) was explored outside the repo to settle on this header/hero direction before writing real code; the scroll-fade behavior itself is deferred to M3, when real cards exist to animate.

**Next milestone:** M2 — sample data (`data/opportunities.json`) covering each opportunity type and the archive-logic edge cases (past deadline, no deadline, already filled, deadline today).

---

## 2026-09-29 — M2: Sample data

**Prompt series:** Build M2; a code review pass asking what might break as-built so far; a forward-looking discussion of what changes when employer self-submission is added later.

**What was built:**
- `data/opportunities.json`: 6 entries, one per opportunity type (job, fellowship, internship, volunteer types covered across them) plus every M2-required edge case — a `deadline: null` rolling opportunity, a `status: "filled"` entry with a future deadline, a past-deadline entry, and a deadline-equals-today entry. Validated with `python3 -m json.tool`.
- Review pass surfaced no functional breaks in M0/M1; flagged (for later, not fixed now) the two dead nav links (`archive.html`/`about.html` don't exist until M6/M9) and a missing favicon (deferred to M9).
- Forward-looking note captured for M6: when the "is this active" check is written, it must be an allow-list (`status === "active"`) rather than a deny-list (`status is not filled/archived`), so a future status value (e.g. a `pending` state for unreviewed employer submissions) fails safe (hidden) instead of failing open (shown) if the filtering code isn't updated at the same time it's introduced.
- Additional sample-data edge cases identified but deliberately not yet added (revisit once M3 renders something): an explicit `status: "archived"` entry, an entry with a field truly absent (not just `null`), a long title/description for overflow testing, and two entries from the same organization.

**Next milestone:** M3 — render opportunities from `data/opportunities.json` onto `index.html` via `js/data.js` and `js/render.js`.

---

## 2026-09-29 — M3: Render opportunities

**Prompt:** Build M3.

**What was built:**
- `js/data.js`: `loadOpportunities()` fetches and parses `data/opportunities.json`.
- `js/render.js`: formats each opportunity's location, deadline, and lived-experience-relevance text, builds a card (wrapped in a link to `opportunity.html?id=...`, built next at M4), and `renderOpportunities()` inserts all cards into `.opportunity-grid`.
- `js/main.js`: on `DOMContentLoaded`, loads the data and renders it — no filtering/archiving yet, so all 6 sample entries show, including the filled and past-deadline ones.
- `index.html`: added the three deferred script tags in dependency order.
- `css/styles.css`: added card styling (type badge, title, org/location line, description, deadline + relevance footer row).
- `README.md`: documented that `fetch()` requires a local server (`python3 -m http.server`), not opening the file directly.
- Verified end-to-end: started a local server, confirmed `index.html` and the JSON both serve correctly, and visually confirmed all 6 cards render in the browser.

**Next milestone:** M4 — opportunity detail view (`opportunity.html`, reads `?id=`).

---

## 2026-09-29 — M4: Opportunity detail view

**Prompt:** Build M4.

**What was built:**
- `opportunity.html`: same header/footer as `index.html`, with an empty `.opportunity-detail` section that `js/render.js` fills in based on the URL's `?id=`.
- `js/render.js`: added `renderOpportunityDetail()` (title, org/location, description, a fact list for compensation/deadline/lived-experience relevance that skips any missing field, and an Apply link/button), plus `createApplyLink()` (external link in a new tab for `url` applyMethods, `mailto:` for `email` ones) and `addDetailFact()` (drops a fact row entirely if the value is falsy, so missing optional fields don't render "undefined").
- `js/main.js`: now branches on which section is present on the page — renders the grid on the home page, or looks up the opportunity by `?id=` and renders its detail on the detail page.
- `css/styles.css`: added detail-page layout (centered column, title, fact list, apply button, not-found message styling).
- Verified: a `url`-applyMethod listing, an `email`-applyMethod listing, an invalid `?id=`, and no `?id=` at all — all four behaved as expected (correct apply link type; friendly not-found message for the invalid/missing cases).

**Next milestone:** M5 — filter/search controls on the home page (type, remote/hybrid/onsite, paid/unpaid, keyword).
