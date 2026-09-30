# Adding an opportunity

Opportunities live as one JSON array in [`data/opportunities.json`](../data/opportunities.json). To add one, copy the template below into that array, fill it in, validate the file, and commit.

## Steps

1. Open `data/opportunities.json`.
2. Copy the template below and paste it as a new entry in the array (add a comma after the previous entry's closing `}`).
3. Fill in every field using the guidance below.
4. Validate the JSON before committing — a single missing comma or quote will break the whole site, since every page loads this one file:
   ```
   python3 -m json.tool data/opportunities.json
   ```
   If that command prints the file back out without an error, it's valid. If it errors, it'll point you to roughly where the syntax problem is.
5. Commit and push as usual.

## Template

```json
{
  "id": "2026-your-slug-here-011",
  "title": "",
  "organization": "",
  "type": "job",
  "description": "",
  "livedExperienceRelevance": "welcomed",
  "location": { "type": "remote", "city": null, "state": null },
  "isPaid": true,
  "compensation": "",
  "datePosted": "2026-01-01",
  "deadline": null,
  "status": "active",
  "applyMethod": { "type": "url", "value": "" },
  "source": "owner-added",
  "lastUpdated": "2026-01-01"
}
```

## Field-by-field

- **`id`** — must be unique across the whole file. Convention: `<year-posted>-<short-slug>-<3-digit-number>`, e.g. `2026-outreach-coordinator-009`. Check the last entry in the file for the next number.
- **`title`**, **`organization`** — plain text, as they should display.
- **`type`** — one of `job`, `fellowship`, `internship`, `volunteer`. (Nothing else yet — see the plan file for why this list is deliberately short for v1.)
- **`description`** — one or two plain-language sentences. Avoid jargon; aim for something a first-time applicant would understand without a glossary.
- **`livedExperienceRelevance`** — one of `required`, `preferred`, `welcomed`, `relevant`. This describes the *opportunity's* fit, never the applicant — it's how a listing signals relevance without asking anyone to disclose anything about themselves. Word the surrounding `description` the same way: lived experience is framed as expertise the role values, not a deficit being accommodated. Avoid labeling who the role is "for" by system involvement (no "formerly incarcerated," "at-risk," "second-chance," etc.) anywhere in the listing text.
- **`location`** — `type` is `remote`, `hybrid`, or `onsite`. For `remote`, leave `city`/`state` as `null`. For `hybrid`/`onsite`, fill both in.
- **`isPaid`** — `true` or `false`. This is what the Pay filter actually checks — keep it consistent with what `compensation` says (don't set `isPaid: true` next to `compensation: "Unpaid"`).
- **`compensation`** — free-text, for display only, e.g. `"Paid, $22/hr"`, `"Paid, $52,000/yr"`, `"Unpaid"`, `"Stipend, $500/month"`.
- **`datePosted`** — `YYYY-MM-DD`, the day it went live on the site.
- **`deadline`** — `YYYY-MM-DD`, or `null` for a rolling/ongoing opportunity with no cutoff. The deadline date is inclusive — a listing due "today" still shows as active through the end of that day.
- **`status`** — `active`, `filled`, or `archived`. Start new listings at `active`. Nothing on the site sets this automatically except the deadline-based archiving — `filled` and `archived` are always something you set by hand, once you hear from the organization (or decide to pull a listing yourself).
- **`applyMethod`** — `type` is `url` or `email`. For `url`, `value` is the link the applicant is sent to (the organization's own application process — this site never collects applications itself). For `email`, `value` is the address a "Apply via email" link should open a draft to.
- **`source`** — leave as `"owner-added"` for now. (`"employer-submitted"` is reserved for a future submission workflow — don't use it yet.)
- **`lastUpdated`** — `YYYY-MM-DD`, bump this whenever you edit an existing entry.

## When something changes

- **Filled** — a partner tells you the role's been taken, or you notice it yourself: set `"status": "filled"` and update `lastUpdated`. It'll move to the Archive page's "Filled" group automatically.
- **Past its deadline** — nothing to do. It archives itself into the "Deadline passed" group the day after `deadline`.
- **Pulling a listing for another reason** — set `"status": "archived"`.
