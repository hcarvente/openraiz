// render.js — turns opportunity data objects into DOM cards.
// No filtering or archiving logic lives here (that's filter.js / archive.js);
// this file only knows how to draw whatever list it's handed.

/**
 * Shows a friendly message in whichever content container is present on the
 * page, used when the opportunity data itself fails to load or parse (so a
 * visitor sees something instead of a silently blank page).
 */
function showLoadError() {
  const container = document.querySelector(".opportunity-grid, .archive-groups, .opportunity-detail");
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const message = document.createElement("p");
  message.className = "opportunity-empty-state";
  message.textContent = "We couldn't load opportunities right now. Please try refreshing the page in a moment.";
  container.appendChild(message);
}

/**
 * Turns a location object into a short display string,
 * e.g. "Oakland, CA (Hybrid)", "Remote", or "Onsite".
 */
function formatLocation(location) {
  if (location.type === "remote") {
    return "Remote";
  }
  const place = [location.city, location.state].filter(Boolean).join(", ");
  const typeLabel = location.type === "hybrid" ? "Hybrid" : "Onsite";
  return place ? `${place} (${typeLabel})` : typeLabel;
}

/**
 * Turns a deadline (or null) into a short display string,
 * e.g. "Deadline: Nov 15" or "Rolling".
 */
function formatDeadline(deadline) {
  if (!deadline) {
    return "Rolling";
  }
  const date = new Date(`${deadline}T00:00:00`);
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `Deadline: ${formatted}`;
}

/**
 * Turns a livedExperienceRelevance value into the phrase shown on a card.
 */
function formatRelevance(relevance) {
  const labels = {
    required: "Lived experience required",
    preferred: "Lived experience preferred",
    welcomed: "Lived experience welcomed",
    relevant: "Lived experience relevant",
  };
  return labels[relevance] || "";
}

/**
 * Builds one card (wrapped in a link to its detail page) for a single opportunity.
 */
function createOpportunityCard(opportunity) {
  const card = document.createElement("div");
  card.className = "opportunity-card";

  const badge = document.createElement("span");
  badge.className = "opportunity-type";
  badge.textContent = opportunity.type.toUpperCase();
  card.appendChild(badge);

  const title = document.createElement("h3");
  title.className = "opportunity-title";
  title.textContent = opportunity.title;
  card.appendChild(title);

  const org = document.createElement("p");
  org.className = "opportunity-org";
  org.textContent = `${opportunity.organization} · ${formatLocation(opportunity.location)}`;
  card.appendChild(org);

  const description = document.createElement("p");
  description.className = "opportunity-description";
  description.textContent = opportunity.description;
  card.appendChild(description);

  const meta = document.createElement("div");
  meta.className = "opportunity-meta";

  const deadline = document.createElement("span");
  deadline.textContent = formatDeadline(opportunity.deadline);
  meta.appendChild(deadline);

  const relevance = document.createElement("span");
  relevance.className = "opportunity-relevance";
  relevance.textContent = formatRelevance(opportunity.livedExperienceRelevance);
  meta.appendChild(relevance);

  card.appendChild(meta);

  // The whole card is clickable; links to the detail page built in M4.
  const link = document.createElement("a");
  link.className = "opportunity-card-link";
  link.href = `opportunity.html?id=${encodeURIComponent(opportunity.id)}`;
  link.appendChild(card);
  return link;
}

/**
 * Clears and re-renders the opportunity grid from a list of opportunities.
 * Shows a friendly empty-state message instead of a blank grid when the list is empty
 * (e.g. a filter combination that matches nothing).
 */
function renderOpportunities(opportunities) {
  const grid = document.querySelector(".opportunity-grid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";

  if (opportunities.length === 0) {
    const empty = document.createElement("p");
    empty.className = "opportunity-empty-state";
    empty.textContent = "No opportunities match your filters.";
    grid.appendChild(empty);
    return;
  }

  opportunities.forEach((opportunity) => {
    // One malformed entry (e.g. a hand-edit missing a required field) shouldn't
    // take every other opportunity down with it — skip just that card.
    try {
      grid.appendChild(createOpportunityCard(opportunity));
    } catch (error) {
      console.error("Skipped a malformed opportunity:", opportunity, error);
    }
  });
}

/**
 * Adds one label/value pair to a <dl>, skipping it entirely if there's no value
 * (so an opportunity missing an optional field, like compensation, just omits that row).
 */
function addDetailFact(list, label, value) {
  if (!value) {
    return;
  }
  const term = document.createElement("dt");
  term.textContent = label;
  const definition = document.createElement("dd");
  definition.textContent = value;
  list.appendChild(term);
  list.appendChild(definition);
}

/**
 * Builds the "Apply" link: a mailto: for email applyMethods, or an
 * external link (new tab) for url applyMethods.
 */
function createApplyLink(opportunity) {
  const link = document.createElement("a");
  link.className = "opportunity-apply-button";
  if (opportunity.applyMethod.type === "email") {
    link.href = `mailto:${opportunity.applyMethod.value}`;
    link.textContent = "Apply via email";
  } else {
    link.href = opportunity.applyMethod.value;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Apply on ${opportunity.organization}'s site`;
  }
  return link;
}

/**
 * Renders the archive page: one labeled group per reason (expired, filled,
 * manually archived), each with its own card grid; skips empty groups, and
 * shows "Archive is empty." if there's nothing archived at all.
 */
function renderArchiveGroups(groups) {
  const container = document.querySelector(".archive-groups");
  if (!container) {
    return;
  }
  container.innerHTML = "";

  const sections = [
    { key: "expired", label: "Deadline passed" },
    { key: "filled", label: "Filled" },
    { key: "archived", label: "Archived" },
  ];

  const hasAny = sections.some((section) => groups[section.key].length > 0);
  if (!hasAny) {
    const empty = document.createElement("p");
    empty.className = "opportunity-empty-state";
    empty.textContent = "Archive is empty.";
    container.appendChild(empty);
    return;
  }

  sections.forEach((section) => {
    const list = groups[section.key];
    if (list.length === 0) {
      return;
    }

    const groupEl = document.createElement("div");
    groupEl.className = "archive-group";

    const heading = document.createElement("h2");
    heading.className = "archive-group-heading";
    heading.textContent = `${section.label} (${list.length})`;
    groupEl.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "opportunity-grid";
    list.forEach((opportunity) => {
      // Same per-item isolation as the home page's grid — see renderOpportunities().
      try {
        grid.appendChild(createOpportunityCard(opportunity));
      } catch (error) {
        console.error("Skipped a malformed opportunity:", opportunity, error);
      }
    });
    groupEl.appendChild(grid);

    container.appendChild(groupEl);
  });
}

/**
 * Fills the .opportunity-detail section with one opportunity's full detail,
 * or a friendly not-found message if no matching opportunity was passed in.
 */
function renderOpportunityDetail(opportunity) {
  const container = document.querySelector(".opportunity-detail");
  if (!container) {
    return;
  }
  container.innerHTML = "";

  if (!opportunity) {
    document.title = "Opportunity not found — OpenRaíz";
    const message = document.createElement("p");
    message.className = "opportunity-detail-not-found";
    message.textContent = "We couldn't find that opportunity. It may have been removed, or the link may be incorrect.";
    container.appendChild(message);
    return;
  }

  document.title = `${opportunity.title} — OpenRaíz`;

  const badge = document.createElement("span");
  badge.className = "opportunity-type";
  badge.textContent = opportunity.type.toUpperCase();
  container.appendChild(badge);

  const title = document.createElement("h1");
  title.className = "opportunity-detail-title";
  title.textContent = opportunity.title;
  container.appendChild(title);

  const org = document.createElement("p");
  org.className = "opportunity-org";
  org.textContent = `${opportunity.organization} · ${formatLocation(opportunity.location)}`;
  container.appendChild(org);

  const description = document.createElement("p");
  description.className = "opportunity-detail-description";
  description.textContent = opportunity.description;
  container.appendChild(description);

  const facts = document.createElement("dl");
  facts.className = "opportunity-detail-facts";
  addDetailFact(facts, "Compensation", opportunity.compensation);
  addDetailFact(facts, "Deadline", formatDeadline(opportunity.deadline));
  addDetailFact(facts, "Lived experience", formatRelevance(opportunity.livedExperienceRelevance));
  container.appendChild(facts);

  container.appendChild(createApplyLink(opportunity));
}
