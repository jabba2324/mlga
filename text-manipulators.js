function highlightKeywords(keywords) {
  // Prevent multiple simultaneous highlighting operations
  if (isHighlighting) {
    return;
  }

  isHighlighting = true;

  // Remove existing highlights
  document.querySelectorAll('.keyword-highlight').forEach(el => {
    el.outerHTML = el.innerHTML;
  });

  if (keywords.length === 0) {
    isHighlighting = false;
    return;
  }

  // Create single tree walker - only text nodes in allowed elements
  const allowedTags = ['DIV', 'SPAN', 'P','STRONG'];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        return allowedTags.includes(node.parentNode.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    },
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  // Process each text node once for all keywords
  textNodes.forEach(textNode => {
    const parent = textNode.parentNode;
    let text = textNode.nodeValue;
    let hasMatch = false;

    // Check all keywords against this text node
    keywords.forEach(({ keyword, color }) => {
      if (!keyword.trim()) return;

      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
        text = text.replaceAll(keyword, `<span class="keyword-highlight" style="background-color: ${rgbaColor};">${keyword}</span>`);
        hasMatch = true;
      }
    });

    // Only modify DOM if there was a match
    if (hasMatch) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = text;
      while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, textNode);
      }
      parent.removeChild(textNode);
    }
  });

  isHighlighting = false;
}

let savedKeywords = [];
let isHighlighting = false;

// Load keywords on page load
try {
  chrome.storage.sync.get(['keywords'], (result) => {
    if (result.keywords && result.keywords.length > 0) {
      savedKeywords = result.keywords.filter(({ keyword }) => keyword.trim());
    }
  });
} catch (e) {
  console.log('Chrome storage not available for keywords');
}

// Run highlighting every 3 seconds (less frequent)
setInterval(() => {
  if (savedKeywords.length > 0) {
    highlightKeywords(savedKeywords);
  }
}, 5000);

// Listen for storage changes
try {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.keywords) {
      savedKeywords = changes.keywords.newValue ?
        changes.keywords.newValue.filter(({ keyword }) => keyword.trim()) : [];
        highlightKeywords(savedKeywords);
    }
  });
} catch (e) {
  console.log('Chrome storage listener not available');
}