# Make LinkedIn Great Again

A Chrome extension that provides advanced filtering and customization options for LinkedIn's feed.

## Features

### Content Filtering
- **Hide Feed**: Hide the entire main feed
- **Hide Sponsored**: Remove sponsored content and advertisements
- **Hide Job Posts**: Filter out job posting cards
- **Hide Activity Posts**: Remove activity updates
- **Hide Games**: Remove LinkedIn games and game-related content
- **Text Only Posts**: Hide images, videos, and documents to show only text content

### Chill Mode
Apply grayscale filter to all images and SVGs with hover effects to restore color. Creates a less distracting browsing experience.

### Keyword Highlighting
Highlight specific keywords in the feed with custom colors and 40% opacity for better visibility.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `mlga` folder
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon in your toolbar
2. Toggle the filters you want to enable
3. Add keywords with custom colors for highlighting
4. Enable Chill Mode for grayscale images
5. Settings are automatically saved and synced

## Reloading Changes

After modifying the extension code:
1. Go to `chrome://extensions/`
2. Click the refresh icon on your extension card
3. Reload LinkedIn to see the changes

## Technical Details

- Uses CSS injection for efficient filtering
- Runs in all frames including iframes
- MutationObserver for dynamic content handling
- Chrome Storage Sync for settings persistence
