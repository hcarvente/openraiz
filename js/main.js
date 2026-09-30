// main.js — bootstraps each page: loads the data, then renders whichever
// section is present (home page's grid, an archive page, or a detail page).

document.addEventListener("DOMContentLoaded", async () => {
  const opportunities = await loadOpportunities();

  if (document.querySelector(".opportunity-grid")) {
    // Home page: only the active subset is ever handed to the filters,
    // so a filled/expired/archived listing can't resurface via a keyword match.
    const { active } = partitionOpportunities(opportunities);
    initializeFilters(active);
  } else if (document.querySelector(".archive-groups")) {
    // Archive page: the inactive subset, grouped by why each one is archived.
    const { archived } = partitionOpportunities(opportunities);
    renderArchiveGroups(groupArchivedByReason(archived));
  } else if (document.querySelector(".opportunity-detail")) {
    // Detail page: find the one opportunity named by ?id= in the URL.
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const opportunity = opportunities.find((item) => item.id === id);
    renderOpportunityDetail(opportunity);
  }
});
