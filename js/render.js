// render.js — turns opportunity data objects into DOM cards.
// No filtering or archiving logic lives here (that's filter.js / archive.js);
// this file only knows how to draw whatever list it's handed.

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
 */
function renderOpportunities(opportunities) {
  const grid = document.querySelector(".opportunity-grid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";
  opportunities.forEach((opportunity) => {
    grid.appendChild(createOpportunityCard(opportunity));
  });
}
