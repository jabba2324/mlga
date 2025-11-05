let isApplyingChillMode = false;

function applyChillMode() {
  if (isApplyingChillMode) return;
  isApplyingChillMode = true;

  // Add CSS for img and svg elements if not already added
  if (!document.getElementById('chill-mode-styles')) {
    const style = document.createElement('style');
    style.id = 'chill-mode-styles';
    style.textContent = `
      img, svg {
        filter: grayscale(100%);
        transition: filter 0.3s ease;
      }
      img:hover, svg:hover {
        filter: grayscale(0%);
      }
    `;
    document.head.appendChild(style);
  }
  
  isApplyingChillMode = false;
}

function removeChillMode() {
  // Remove the CSS styles
  const styleElement = document.getElementById('chill-mode-styles');
  if (styleElement) {
    styleElement.remove();
  }
}

let chillModeActive = false;

// Load chill mode setting on page load
try {
  chrome.storage.sync.get(['chillMode'], (result) => {
    chillModeActive = result.chillMode === true;
    if (chillModeActive) {
      applyChillMode();
    }
  });
} catch (e) {
  console.log('Chrome storage not available for chill mode');
}

// Watch for DOM changes and reapply chill mode
const chillObserver = new MutationObserver((mutations) => {
  if (chillModeActive) {
    // Only apply if mutation contains new IMG or SVG elements
    const hasNewImages = mutations.some(mutation => 
      Array.from(mutation.addedNodes).some(node => 
        node.tagName === 'IMG' || node.tagName === 'SVG' ||
        node.querySelector?.('img, svg')
      )
    );
    
    if (!hasNewImages) return;
    
    chillObserver.disconnect();
    applyChillMode();
    chillObserver.observe(document.body, { childList: true, subtree: true });
  }
});
chillObserver.observe(document.body, { childList: true, subtree: true });

// Listen for chill mode setting changes
try {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.chillMode) {
      chillModeActive = changes.chillMode.newValue === true;
      if (chillModeActive) {
        applyChillMode();
      } else {
        removeChillMode();
      }
    }
  });
} catch (e) {
  console.log('Chrome storage listener not available for chill mode');
}