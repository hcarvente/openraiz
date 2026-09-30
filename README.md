# OpenRaiz

A lightweight job board for young adults whose lived experience with systems — justice, immigration, foster care, housing instability, and others — has often created barriers to employment. Government, nonprofit, philanthropy, and other mission-aligned employers list jobs, fellowships, internships, and volunteer/leadership opportunities here.

Incubated by Alianza for Opportunity, developed as its own standalone brand.

## Running locally

`index.html` is the About/landing page (static, no data). The opportunities list, an individual opportunity's detail page, and the archive all load data with `fetch("data/opportunities.json")`, which browsers block when a page is opened directly from disk (`file://...`). Serve the folder over a local server instead:

```
cd path/to/openraiz
python3 -m http.server
```

Then open `http://localhost:8000` in your browser, and follow the "Browse opportunities" button (or the nav) to `opportunities.html` to see the listings.

*Deploy instructions will be added at M10.*
