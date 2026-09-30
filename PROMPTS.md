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

**Next up:** the About page (`about.html`) + Alianza relationship framing ("Incubated by Alianza for Opportunity," not "Alianza's OpenRaiz") — see the entries below (logged descriptively rather than as a numbered milestone, per a later change to this log's cadence).

---

## 2026-09-29 — About page becomes the landing page

**Prompt series:** Build the About page; decide (given it's a real restructuring, not just a new page) to make it the landing page instead of a secondary tab, with a "Browse opportunities" CTA into the listings.

**What was built:**
- Renamed the listings page from `index.html` to `opportunities.html`; the new `index.html` is now the About/landing page (mission copy, "you belong here because of what you bring" framing, "Incubated by Alianza for Opportunity — OpenRaíz is its own standalone project" line, and a "Browse opportunities" CTA into `opportunities.html`). Nav repointed across all four pages (`index.html`, `opportunities.html`, `opportunity.html`, `archive.html`) and reordered to About / Opportunities / Archive. `README.md` updated to describe the new page roles.
- Fixed the mission paragraphs from centering every line (an `align-items: center` flex side-effect that shrank each `<p>` to its own content width) to reading left-to-right at full width, and wrapped the mission text in a framed card matching the existing `.opportunity-card` visual language (white background, border, radius, soft shadow) so it reads as a designed panel instead of floating on blank page background.

**Footnote:** Also fixed the opportunities page's search field to stretch and fill the filter row instead of clustering against the type/location/pay dropdowns (a `flex: 1 1 12rem` addition to `css/styles.css` and a new `filter-field-search` class) — unrelated to the About-page work above, small enough not to warrant its own entry.

---

## 2026-09-29 — Landing page background photo

**Prompt:** Add a real photo (`assets/OpenRaiz_About.png` — a young adult viewed from behind, city skyline at sunset; not identifiable, so no consent/privacy concern) as a faded background on the About/landing page.

**What was built:**
- `.landing-background` class on the `index.html` `<body>`: the photo as a full-page background, tinted with a color overlay matching the site's cream background (`--color-bg`) so it reads as faded and text on top keeps full contrast.
- Opacity tuned from an initial 88% tint down to 60% after visual review, so the photo is more visible.

**Next up:** a mobile-specific problem with this same background surfaced immediately after — see the next entry.

---

## 2026-09-29 — Mobile-specific hero image fix

**Prompt:** Fix how the landing page's background photo displays on a phone-width screen, keeping the person in frame as the page shrinks.

**What was built:**
- Diagnosed the problem: `background-size: cover` on a narrow, tall phone viewport crops a wide landscape photo down to an unflattering vertical sliver, missing the subject — landing squarely on the tree line/rooftops between the person and the skyline. Desktop wasn't affected, since its aspect ratio is close enough to the photo's that `cover` only trims a little off each side.
- Compared two fixes visually first, using two Design-canvas mockups built with the real uploaded photo (full-page-background crop vs. a fixed-height hero band) before choosing.
- Implemented the fixed-height hero band approach, mobile-only: below a 699px breakpoint, the whole-page background is replaced with a 220px-tall `<img>` band using `object-fit: cover` and a tuned `object-position` (`28% 42%`) that keeps the person framed consistently as the viewport narrows. Desktop keeps the original whole-page background unchanged.

**Next milestone:** M9 — polish pass (accessibility, favicon, responsive check).

---

## 2026-09-29 — M9: Polish pass

**Prompt:** Build M9 — accessibility check, favicon, meta tags, responsive review.

**What was built:**
- Found and fixed a real contrast issue during the accessibility check: `--color-muted` (used for org/location lines, filter labels, nav links, footer) only had a 3.5:1 contrast ratio against the page background — below the WCAG AA 4.5:1 requirement for normal text. Darkened it to `#6B6459` (5.46:1), and pointed `.site-nav a`'s previously-hardcoded copy of that same color at the shared variable instead, so there's one source of truth.
- Added `assets/favicon.svg` (the existing feather mark, reused rather than a new asset) and linked it on all four pages, alongside a `<meta name="description">` tuned to each page's content.
- Added `aria-current="page"` next to the visual `.is-active` class on each page's real current-page nav link (not on `opportunity.html`'s "Opportunities" link, since that page's URL doesn't literally match `opportunities.html` — the visual highlight there is a deliberate "belongs to this section" choice, not a same-page indicator).
- Found and fixed a heading-hierarchy gap: `archive.html` had no `<h1>`, jumping straight to the `<h2>` group headings — added a page-level "Archive" heading.
- `opportunity.html`'s `<title>` was static ("OpenRaíz") regardless of which listing was open; `renderOpportunityDetail()` now sets it to the opportunity's own name (or "Opportunity not found") once rendered, so the browser tab and screen-reader announcement are both useful.
- Responsive layout across all four pages was reviewed and found already handled by the mobile-first approach built up through earlier milestones — no changes needed there.

**Next milestone:** M10 — deploy to GitHub Pages (create the repo's Pages config, resolve the `/docs` naming collision, verify the live JSON fetch).

---

## 2026-09-30 — New logo mark: sprout replaces feather, favicon + social card

**Prompt series:** A design exploration asking whether the feather icon felt "off brand"; agreed it did (a feather symbolizes flight/lightness, while "Raíz" means root — the two ideas don't reinforce each other, and the feather also reads as a generic startup-logo cliché). Explored several root-themed, abstract, and non-root icon concepts, in both side-by-side and stacked lockup styles, before settling on a sprout mark. Then: "create this logo, favicon, create the images and update all the files."

**What was built:**
- Replaced the feather SVG with a sprout mark (stem + leaf curves above a ground line, three root tendrils below) in the header of all four pages (`index.html`, `opportunities.html`, `opportunity.html`, `archive.html`) and in `assets/favicon.svg`.
- Installed `cairosvg` (plus its system dependency, the Homebrew `cairo` library) to rasterize the real vector icon into PNGs, rather than hand-approximating it: `assets/favicon-32.png` and `assets/favicon-180.png` (apple-touch-icon), linked as fallbacks alongside the existing SVG favicon for browsers/contexts that don't support SVG favicons.
- Built `assets/og-image.png` (1200×630): the sprout icon plus the "OpenRaíz" wordmark and tagline, composited with Pillow using a system serif font (Georgia Bold) as a stand-in for Fraunces, which isn't installed locally for rasterization — worth revisiting once the site is deployed and the real font can be captured from a live render instead.
- Wired Open Graph (`og:title`, `og:description`, `og:image`, `og:type`) and `twitter:card` meta tags into all four pages, each with page-specific title/description text; `og:url` deliberately left out until M10 gives the site a real deployed domain.
- All the icon/root/abstract/non-root concept exploration happened in the same external Design-canvas mockup used throughout this project — nothing in that canvas is part of the delivered site.

**Next milestone:** M10 — deploy to GitHub Pages (create the repo's Pages config, resolve the `/docs` naming collision, verify the live JSON fetch, and once live, consider recapturing the OG image with the real Fraunces font).

---

## 2026-09-30 — Final v1 review: error handling, stale comment, image size

**Prompt series:** "Look at all the files, do a final check of as many possible edge cases for v1, and anything that could easily break the code." Reviewed every file; found four issues, ranked them by severity in a table on request, then: "Fix 1 & 2, fix the leftover comment, and pick the most optimal file size for the about page photo."

**What was found and fixed:**
- **No error handling if the data file fails to load or parse** — `main.js` now wraps `loadOpportunities()` in a try/catch; on failure it calls a new `showLoadError()` (in `render.js`) that shows a friendly message ("We couldn't load opportunities right now...") in whichever content container is present, instead of leaving the page silently blank. Also wrapped the detail page's `renderOpportunityDetail()` call, so a malformed entry for that specific `?id=` shows the same message instead of crashing.
- **One malformed entry could take down every other listing** — `renderOpportunities()` and `renderArchiveGroups()`'s per-item loops now wrap each `createOpportunityCard()` call in its own try/catch, logging and skipping just the bad entry instead of aborting the whole render.
- **Verified both fixes live**: temporarily broke the whole JSON file (confirmed the friendly error shows on all three data-driven pages), then temporarily removed one entry's `type` field (confirmed the other 7 active listings still rendered, with the bad one silently skipped and logged to console) — restored the real data byte-for-byte after each test.
- Fixed a stale CSS comment that still said "feather mark" post-logo-swap.
- Replaced `assets/OpenRaiz_About.png` (1.69MB) with `assets/OpenRaiz_About.jpg` (149KB, quality-82 JPEG — visually identical for a photo like this), updated both references (`index.html`'s `<img>`, `styles.css`'s background-image), and removed the old PNG from the repo.
- Noted but left as-is (lower severity, not fixed this pass): a malformed `deadline` string fails silently (never expires) rather than erroring, and nothing validates `id` uniqueness across entries.

**Next milestone:** M10 — deploy to GitHub Pages.

---

## 2026-09-30 — M10: Deploy to GitHub Pages (closed out)

**Prompt:** Formally close out M10, and expand the README with what v1 actually does versus what's deliberately deferred to later versions.

**What was verified/built:**
- GitHub Pages was already enabled (done independently, outside this logged workflow) at `https://hcarvente.github.io/openraiz/`, serving from `main` / root — no `/docs` naming collision, since Pages isn't configured to use the "docs folder" build source; `docs/ADDING-AN-OPPORTUNITY.md` is just a regular file at that path.
- Verified every real page and asset resolves on the live URL (`index.html`, `opportunities.html`, `opportunity.html?id=...`, `archive.html`, all `js/*` and `css/*` files, all `assets/*` files, `data/opportunities.json`) — all 200s, matching the plan's M10 verification step of checking the actual deployed paths rather than only localhost.
- Fetched the live `data/opportunities.json` and confirmed it's valid, has all 10 entries, and matches the restored local data exactly — no leftover corruption from the prior session's intentional-breakage testing.
- `README.md` rewrote with: the live site link; a "what this version does" section (About/Opportunities/Detail/Archive pages, the one-JSON-file data model, no backend/no self-submission yet); a "what's deliberately not built yet" section (employer self-submission, admin UI, real backend, job-seeker accounts, richer filters/types, multi-language, formal accessibility audit, org profiles, analytics, AI matching); and a "Deploying" section explaining the Pages config and that push-to-`main` is the entire deploy step.

**Status:** All 11 planned milestones (M0–M10) are now complete. v1 is live.

---

## 2026-09-30 — New feature: location badge + organization address/Maps link

**Prompt series:** Scoped two v1.1 feature ideas (organization addresses linking to Google Maps; in-person/hybrid/virtual badges on cards). Iterated on the badge through several rounds: confirmed it should be a static label (not a filter button, which would have required restructuring the card away from its current whole-card-link design to avoid nesting a button inside a link); confirmed layout (type badge left, location badge right, one row); gave each location type its own color, distinct from the type-badge palette. Added real public addresses to the sample data with a documented caveat. Renamed the Location filter's option labels to match the badge wording. Simplified the org/location text line to drop what's now redundant with the badge.

**What was built:**
- `js/render.js`: cards now show a `.badge-row` with the type badge (left) and a new static `location-badge` (right) — colored by type (`location-badge-onsite` blue, `location-badge-hybrid` teal, `location-badge-remote` slate) — labeled "In-person"/"Hybrid"/"Virtual". No click behavior; kept as a plain `<span>` since it doesn't need to be interactive, which also avoids the nested-interactive-element problem a clickable version would have created inside the existing whole-card link.
- `location.address` (optional) added to the schema; the detail page now shows an "Address" fact that links out to Google Maps (`google.com/maps/search/?api=1&query=...`) via `addAddressFact()`, skipped entirely for remote listings or any entry without one.
- Backfilled the 5 onsite/hybrid sample entries with real public civic addresses (city halls, etc.) in their existing cities, so the Maps links resolve to a real place — documented in `docs/ADDING-AN-OPPORTUNITY.md` as a caveat: these are real public addresses used for demo purposes, not verified addresses for the (fictional) organizations attached to them.
- `opportunities.html`'s Location filter option labels changed to match the badge wording (Virtual/Hybrid/In-person instead of Remote/Hybrid/Onsite); underlying values unchanged.
- `formatLocation()` simplified to return only city/state (or "" for remote) instead of repeating the location type in parentheses, since the badge now owns that; added `formatOrgLine()` to cleanly omit the separator when there's no city/state to show (remote listings now read as just the organization name, with the badge carrying the "Virtual" signal).
- Visual exploration (badge layout and per-type colors) happened first in the same external Design-canvas mockup used throughout, before writing real code.
