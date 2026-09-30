# OpenRaiz

A lightweight job board for young adults whose lived experience with systems — justice, immigration, foster care, housing instability, and others — has often created barriers to employment. Government, nonprofit, philanthropy, and other mission-aligned employers list jobs, fellowships, internships, and volunteer/leadership opportunities here.

Incubated by Alianza for Opportunity, developed as its own standalone brand.

**Live site:** https://hcarvente.github.io/openraiz/

## What this version (v1) actually does

- **About page** (`index.html`) — the landing page: states the mission and links into the opportunities list. Static, no data loading.
- **Opportunities page** (`opportunities.html`) — every active listing as a card, with client-side filters (type, location, paid/unpaid) and a keyword search. All filtering happens in the browser against the one JSON file below; nothing is fetched from a server per search.
- **Opportunity detail page** (`opportunity.html?id=...`) — one listing's full description, compensation, deadline, lived-experience relevance, and an apply link/button that sends the applicant to the employer's own application process (an external URL or a `mailto:`). This site never collects applications itself.
- **Archive page** (`archive.html`) — listings that are no longer active, grouped by why: deadline passed, filled, or manually archived. A listing archives itself automatically once its deadline passes (inclusive of the whole day); "filled" and "archived" are always set by hand once you hear from the organization.
- **The whole dataset** is one hand-edited file, `data/opportunities.json` — see `docs/ADDING-AN-OPPORTUNITY.md` for the schema and the steps to add a listing. There's no backend, no database, and no employer self-submission yet; you (the owner) are the only one who adds or updates listings.

## What's deliberately not built yet (planned for later versions)

- **Employer self-service submission** — a form employers fill out themselves, landing in a review queue before anything goes live, instead of you hand-editing the JSON for every new listing.
- **Admin login/UI** for managing listings through a page instead of editing JSON directly.
- **A real backend/database**, once the static-JSON approach stops scaling for the volume of listings or the number of people touching the data.
- **Accounts for job seekers** — saved/favorited opportunities, application tracking, email alerts for new matches.
- **Richer filters** (experience type, organization type, age eligibility) and **additional opportunity types** (apprenticeships, training, board/advisory roles) beyond the four in v1 (job, fellowship, internship, volunteer).
- **Multi-language support**, notably Spanish.
- **A formal accessibility (WCAG) audit** beyond the baseline pass already done in v1.
- **Organization profile pages**, employer verification, analytics, and AI-assisted matching.

None of these are missing by accident — the v1 goal was the smallest version that proves the core loop (browse → view detail → apply elsewhere) works end to end, without adding complexity the project doesn't need yet.

## Running locally

`index.html` is the About/landing page (static, no data). The opportunities list, an individual opportunity's detail page, and the archive all load data with `fetch("data/opportunities.json")`, which browsers block when a page is opened directly from disk (`file://...`). Serve the folder over a local server instead:

```
cd path/to/openraiz
python3 -m http.server
```

Then open `http://localhost:8000` in your browser, and follow the "Browse opportunities" button (or the nav) to `opportunities.html` to see the listings.

## Deploying

The live site is served by GitHub Pages directly from this repo's `main` branch root (Settings → Pages → Source: `main` / `/ (root)`). `docs/ADDING-AN-OPPORTUNITY.md` lives at `/docs` in this repo, but that's just a regular folder here — it's not the Pages "docs folder" build source, so there's no conflict between the two.

To publish a change: commit and push to `main` as usual; GitHub Pages rebuilds automatically within a minute or two. No build step, no separate deploy command.
