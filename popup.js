// Load saved settings
chrome.storage.sync.get(['hideFeed', 'hideSponsored', 'hideJobs', 'hideActivity', 'hideGames', 'textOnly', 'chillMode', 'keywords'], (result) => {
  const toggleFeed = document.getElementById('toggleFeed');
  const toggleSponsored = document.getElementById('toggleSponsored');
  const toggleJobs = document.getElementById('toggleJobs');
  const toggleActivity = document.getElementById('toggleActivity');
  const toggleGames = document.getElementById('toggleGames');
  const toggleTextOnly = document.getElementById('toggleTextOnly');
  const toggleChillMode = document.getElementById('toggleChillMode');
  
  if (toggleFeed) toggleFeed.checked = result?.hideFeed === true;
  if (toggleSponsored) toggleSponsored.checked = result?.hideSponsored !== false;
  if (toggleJobs) toggleJobs.checked = result?.hideJobs === true;
  if (toggleActivity) toggleActivity.checked = result?.hideActivity !== false;
  if (toggleGames) toggleGames.checked = result?.hideGames === true;
  if (toggleTextOnly) toggleTextOnly.checked = result?.textOnly === true;
  if (toggleChillMode) toggleChillMode.checked = result?.chillMode === true;
  
  // Load saved keywords
  if (result.keywords && result.keywords.length > 0) {
    const keywordForms = document.getElementById('keywordForms');
    keywordForms.innerHTML = '';
    result.keywords.forEach(({ keyword, color }) => {
      const form = document.createElement('div');
      form.className = 'keyword-form';
      form.innerHTML = `
        <input type="text" placeholder="Enter keyword" class="keyword-input" value="${keyword}">
        <input type="color" value="${color}" class="color-picker">
        <button type="button" class="remove-keyword">X</button>
      `;
      keywordForms.appendChild(form);
      addFormListeners(form);
    });
  } else {
    // Add listeners to initial form if no saved keywords
    document.querySelectorAll('.keyword-form').forEach(addFormListeners);
  }
});

// Save settings when changed
document.getElementById('toggleFeed')?.addEventListener('change', (e) => {
  console.log('Saving hideFeed:', e.target.checked);
  chrome.storage.sync.set({ hideFeed: e.target.checked });
});

document.getElementById('toggleSponsored')?.addEventListener('change', (e) => {
  console.log('Saving hideSponsored:', e.target.checked);
  chrome.storage.sync.set({ hideSponsored: e.target.checked });
});

document.getElementById('toggleJobs')?.addEventListener('change', (e) => {
  console.log('Saving hideJobs:', e.target.checked);
  chrome.storage.sync.set({ hideJobs: e.target.checked });
});

document.getElementById('toggleActivity')?.addEventListener('change', (e) => {
  console.log('Saving hideActivity:', e.target.checked);
  chrome.storage.sync.set({ hideActivity: e.target.checked });
});

document.getElementById('toggleGames')?.addEventListener('change', (e) => {
  console.log('Saving hideGames:', e.target.checked);
  chrome.storage.sync.set({ hideGames: e.target.checked });
});

document.getElementById('toggleTextOnly')?.addEventListener('change', (e) => {
  console.log('Saving textOnly:', e.target.checked);
  chrome.storage.sync.set({ textOnly: e.target.checked });
});

document.getElementById('toggleChillMode')?.addEventListener('change', (e) => {
  console.log('Saving chillMode:', e.target.checked);
  chrome.storage.sync.set({ chillMode: e.target.checked });
});

// Save keywords to storage
function saveKeywords() {
  const keywords = [];
  document.querySelectorAll('.keyword-form').forEach(form => {
    const keyword = form.querySelector('.keyword-input').value;
    const color = form.querySelector('.color-picker').value;
    keywords.push({ keyword, color });
  });
  chrome.storage.sync.set({ keywords });
}



// Add event listeners to existing forms
function addFormListeners(form) {
  const keywordInput = form.querySelector('.keyword-input');
  const colorPicker = form.querySelector('.color-picker');
  const removeButton = form.querySelector('.remove-keyword');
  
  if (keywordInput) {
    keywordInput.addEventListener('input', saveKeywords);
  }
  if (colorPicker) {
    colorPicker.addEventListener('change', saveKeywords);
  }
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      form.remove();
      saveKeywords();
    });
  }
}

// Add keyword form functionality
document.getElementById('addKeyword')?.addEventListener('click', () => {
  const keywordForms = document.getElementById('keywordForms');
  const newForm = document.createElement('div');
  newForm.className = 'keyword-form';
  newForm.innerHTML = `
    <input type="text" placeholder="Enter keyword" class="keyword-input">
    <input type="color" value="#ffff00" class="color-picker">
    <button type="button" class="remove-keyword">X</button>
  `;
  keywordForms.appendChild(newForm);
  addFormListeners(newForm);
  saveKeywords();
});