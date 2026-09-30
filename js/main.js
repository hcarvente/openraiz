// main.js — bootstraps each page: loads the data, then renders whichever
// section is present (home page's grid, an archive page, or a detail page).

document.addEventListener("DOMContentLoaded", async () => {
  let opportunities;
  try {
    opportunities = await loadOpportunities();
  } catch (error) {
    // The fetch failed, or data/opportunities.json isn't valid JSON — show a
    // visible message instead of leaving the page silently blank.
    console.error("Failed to load opportunities:", error);
    showLoadError();
    return;
  }

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
    try {
      renderOpportunityDetail(opportunity);
    } catch (error) {
      // A malformed entry for this specific id shouldn't leave a blank page.
      console.error("Failed to render opportunity detail:", error);
      showLoadError();
    }
  }
});
