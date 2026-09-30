// filter.js — client-side filter/search for the home page's opportunity grid.
// The DOM's filter controls ARE the filter state: every filter run re-reads
// their current values rather than tracking a separate JS object, so the
// page and the filtering logic can't drift out of sync.

/**
 * True if the opportunity's type matches the selected filter, or the filter is "all".
 */
function matchesType(opportunity, value) {
  return value === "all" || opportunity.type === value;
}

/**
 * True if the opportunity's location type matches the selected filter, or the filter is "all".
 */
function matchesLocation(opportunity, value) {
  return value === "all" || opportunity.location.type === value;
}

/**
 * True if the opportunity's isPaid flag matches the selected filter, or the filter is "all".
 */
function matchesPaid(opportunity, value) {
  if (value === "all") {
    return true;
  }
  return value === "paid" ? opportunity.isPaid : !opportunity.isPaid;
}

/**
 * True if the keyword (case-insensitive) appears in the title, organization, or description.
 * An empty keyword always matches.
 */
function matchesKeyword(opportunity, keyword) {
  if (!keyword) {
    return true;
  }
  const term = keyword.toLowerCase();
  const haystack = `${opportunity.title} ${opportunity.organization} ${opportunity.description}`.toLowerCase();
  return haystack.includes(term);
}

/**
 * Reads the current value of every filter control and returns the matching subset of opportunities.
 */
function getFilteredOpportunities(opportunities) {
  const typeValue = document.getElementById("filter-type").value;
  const locationValue = document.getElementById("filter-location").value;
  const paidValue = document.getElementById("filter-paid").value;
  const keywordValue = document.getElementById("filter-keyword").value.trim();

  return opportunities.filter(
    (opportunity) =>
      matchesType(opportunity, typeValue) &&
      matchesLocation(opportunity, locationValue) &&
      matchesPaid(opportunity, paidValue) &&
      matchesKeyword(opportunity, keywordValue)
  );
}

/**
 * Updates the aria-live result-count message shown above the grid.
 */
function updateResultCount(count) {
  const el = document.querySelector(".filter-result-count");
  if (!el) {
    return;
  }
  el.textContent = count === 1 ? "1 opportunity" : `${count} opportunities`;
}

/**
 * Filters the full list by the current control values, then re-renders the grid and result count.
 */
function applyFilters(allOpportunities) {
  const filtered = getFilteredOpportunities(allOpportunities);
  renderOpportunities(filtered);
  updateResultCount(filtered.length);
}

/**
 * Wires up every filter control to re-filter on change, then runs the first render.
 */
function initializeFilters(allOpportunities) {
  const controlIds = ["filter-type", "filter-location", "filter-paid", "filter-keyword"];
  controlIds.forEach((id) => {
    const control = document.getElementById(id);
    if (!control) {
      return;
    }
    const eventName = control.tagName === "SELECT" ? "change" : "input";
    control.addEventListener(eventName, () => applyFilters(allOpportunities));
  });
  applyFilters(allOpportunities);
}
