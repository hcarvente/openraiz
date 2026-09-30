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

---

## 2026-09-29 — M5: Filter/search controls

**Prompt series:** Discuss how to filter by paid/unpaid given `compensation` is free text; decide to add a real `isPaid` boolean field (backfilled onto all 6 sample entries) instead of parsing the string; build M5.

**What was built:**
- `data/opportunities.json`: added `isPaid: true/false` to every entry, so paid/unpaid filtering is exact instead of guessed from `compensation` text.
- `index.html`: filter markup in `.filters` — labeled keyword search, type/location/paid `<select>`s, and an `aria-live` result-count element.
- `js/filter.js` (new): `matchesType`/`matchesLocation`/`matchesPaid`/`matchesKeyword` check one dimension each; `getFilteredOpportunities()` reads all four control values straight from the DOM and combines the checks with AND logic; `initializeFilters()` wires change/input listeners on each control and does the first render; `updateResultCount()` keeps the aria-live text in sync.
- `js/render.js`: `renderOpportunities()` now shows a "No opportunities match your filters." message instead of a blank grid when a filter combination matches nothing.
- `js/main.js`: home-page path now calls `initializeFilters()` instead of rendering directly.
- `css/styles.css`: filter-bar layout, field/label styling, result-count and empty-state styling.
- Verified: type + pay + keyword filters and their combinations, the empty-result state, and the result count all behaved correctly once a genuinely reloaded (not just refocused) browser tab was checked — an earlier "filters aren't working" report turned out to be a stale tab from before M5 existed, not a code issue.
- Noted for M6: this milestone filters over the full raw list, including the already-filled and past-deadline sample entries. M6 needs to feed filter.js an "active only" subset rather than the raw list, or a filled/expired listing could resurface via a matching keyword search.

**Next milestone:** M6 — deadline-based auto-archive (`js/archive.js`), splitting the list into active vs. archived and building `archive.html`.

---

## 2026-09-29 — M6: Deadline-based auto-archive

**Prompt series:** Build M6; add more sample opportunities so the home page doesn't look bare (keeping the two existing archived examples as-is); a question about what "filled" actually requires operationally.

**What was built:**
- `js/archive.js` (new): `isExpired()` (deadline is inclusive of its whole day — an opportunity due "today" is still active through end of day; `null` never expires), `isActive()` (written as an allow-list — `status === "active"` AND not expired — so a future status value like a `pending` submission fails safe/hidden rather than failing open/shown), `archiveReason()` (filled vs. expired vs. manually archived), `partitionOpportunities()`, and `groupArchivedByReason()`.
- `js/render.js`: added `renderArchiveGroups()` — one labeled group per reason with its own card grid, skipping empty groups, showing "Archive is empty." if nothing's archived.
- `archive.html` (new): same header/footer as the other pages, "Archive" highlighted in nav, filled entirely by `renderArchiveGroups()`.
- `js/main.js`: now loads data once and branches three ways — home page gets `initializeFilters()` fed only the active subset (per the M5 dependency note), the archive page gets the grouped archived subset, detail page unchanged.
- `index.html`: added `archive.js` to the script order (before `filter.js`, since `main.js` needs it to partition before filtering).
- `css/styles.css`: archive page group/heading layout.
- `data/opportunities.json`: added 4 more active sample entries (Intake Volunteer, Reentry Housing Fellow, Outreach Coordinator, Records Expungement Intern) so the home page isn't sparse — 8 active + the same 2 archived (Peer Mentor/filled, Policy Fellow/expired) as before.
- Discussed: "filled" has no automatic detection — it only updates when the owner (or outreach effort) finds out from a partner and hand-edits the status. That's an operational/relationship task inherent to the v1 owner-only model, not something this milestone's code could automate.
- Verified: home page shows exactly the active listings (including the today-deadline one, confirming the inclusive-deadline rule), archive page groups correctly by reason.

**Next milestone:** M7 — owner workflow doc (`docs/ADDING-AN-OPPORTUNITY.md`).

---

## 2026-09-29 — M7: Owner workflow doc

**Prompt:** Build M7.

**What was built:**
- `docs/ADDING-AN-OPPORTUNITY.md`: step-by-step instructions for adding a listing (copy template, fill fields, validate with `python3 -m json.tool`, commit), a filled-in field template matching the current schema (including `isPaid`), field-by-field guidance — notably on wording `livedExperienceRelevance` and `description` without deficit framing or system-involvement labels — and a short section on what to do when a listing gets filled, expires, or needs pulling for another reason.

**Next milestone:** M8 — About page (`about.html`) + Alianza relationship framing ("Incubated by Alianza for Opportunity," not "Alianza's OpenRaiz").
