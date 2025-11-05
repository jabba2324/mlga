// Apply settings on LinkedIn feed page
let settings = { hideFeed: false, hideSponsored: true, hideJobs: false, hideActivity: true, hideGames: false, textOnly: false };

function applyFilters() {
  let styleElement = document.getElementById('content-filter-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'content-filter-styles';
    document.head.appendChild(styleElement);
  }

  let css = '';
  
  if (settings.hideFeed) {
    css += '[data-testid="mainFeed"] { opacity: 0 !important; }';
  }
  
  if (settings.hideSponsored) {
    css += 'div:has(> [componentkey*="_expandedurn:li:sponsoredContent"]) { display: none !important; }';
    css += '.ad-banner, .ad-banner-container, [title="advertisement"] { display: none !important; }';
  }
  
  if (settings.hideJobs) {
    css += '[componentkey*="aggregate"]{ display: none !important; }';
    css += '[componentkey*="jobPosting"] { display: none !important; }';
  }
  
  if (settings.hideActivity) {
    css += 'div:has(> [componentkey*="_expandedurn:li:activity:"]) { display: none !important; }';
    css += 'div:has(> [componentkey*="_expandedurn:li:activity:"]):has(a[href*="job"]) { display: block !important; }';
  }
  
  if (settings.hideGames) {
    css += '[data-view-name*="game"], a[href*="games"] { display: none !important; }';
  }
  
  if (settings.textOnly) {
    css += '[data-view-name="feed-article-image"], [data-view-name="feed-update-image"], video, [aria-label="Video Player"], div:has(> [aria-label="Video Player"]), div:has(> div > [aria-label="Video Player"]), div:has(> [data-view-name="feed-update-image"]), [componentkey*="document-container"] { display: none !important; }';
  }
    
  styleElement.textContent = css;
}



// Try to load settings, fallback to defaults if chrome.storage fails
try {
  chrome.storage.sync.get(['hideFeed', 'hideSponsored', 'hideJobs', 'hideActivity', 'hideGames', 'textOnly'], (result) => {
    settings = { ...settings, ...result };
    applyFilters();
  });
} catch (e) {
  console.log('Chrome storage not available, using defaults');
  applyFilters();
}

// Watch for new content and reapply filters
const observer = new MutationObserver((mutations) => {
  // Only apply if changes are within feed elements
  const isFeedChange = mutations.some(mutation => 
    mutation.target.closest('[data-testid="mainFeed"]') ||
    mutation.target.querySelector?.('[componentkey], [data-view-name="feed-end-of-feed"], .ad-banner, [title="advertisement"]')
  );
  
  if (!isFeedChange) return;
  
  observer.disconnect();
  applyFilters();
  observer.observe(document.body, { childList: true, subtree: true });
});
observer.observe(document.body, { childList: true, subtree: true });



// Try to listen for setting changes
try {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideFeed) settings.hideFeed = changes.hideFeed.newValue;
    if (changes.hideSponsored) settings.hideSponsored = changes.hideSponsored.newValue;
    if (changes.hideJobs) settings.hideJobs = changes.hideJobs.newValue;
    if (changes.hideActivity) settings.hideActivity = changes.hideActivity.newValue;
    if (changes.hideGames) settings.hideGames = changes.hideGames.newValue;
    if (changes.textOnly) settings.textOnly = changes.textOnly.newValue;
    applyFilters();
  });
} catch (e) {
  console.log('Chrome storage listener not available');
}
