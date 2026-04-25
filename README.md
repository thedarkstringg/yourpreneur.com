# Yourpreneur Dashboard

A powerful infinite canvas for visualizing your venture journey. Track ventures, milestones, and relationships in an interactive timeline.

## Features

### Canvas Visualization
- **Infinite Pan & Zoom**: Navigate through your venture landscape seamlessly
- **Venture Nodes**: Visual cards showing venture status, dates, and industry
- **Branch Lines**: Connect parent and child ventures with labeled relationship lines
- **Event Dots**: Colored indicators for important events and milestones
- **Timeline Grid**: Year-based positioning with dot grid background

### Data Management
- **Create Ventures**: Add new ventures with name, description, industry, and status
- **Edit Details**: Modify venture information anytime
- **Delete Ventures**: Remove ventures with confirmation dialog
- **Add Events**: Track launches, funding, milestones, pivots, and more
- **Set Relationships**: Define parent-child ventures for spinoffs and pivots

### Organization & Discovery
- **Search & Filter**: Find ventures by name or filter by status
- **Sort Options**: Organize by name, start date, or status
- **Statistics Dashboard**: View metrics including venture counts, event distribution, and timeline
- **Status Tracking**: Active, Pivot, Paused, Shutdown, Exited

### Controls
- **Keyboard Shortcuts**:
  - `N` - Create new venture
  - `M` - Modify selected venture
  - `P` - Toggle preview mode
  - `L` - Toggle ventures list
  - `S` - Show statistics
  - `?` - Show keyboard help

- **Toolbar Buttons**: Generate, Modify, Preview, List, Help, Data management

### Data Persistence
- **Export**: Download your ventures as JSON
- **Import**: Load previously exported data
- **Clear Data**: Reset everything (with confirmation)

## Quick Start

1. **Create Your First Venture** - Press `N` or click "Generate" button
2. **Add Events** - Double-click a venture, then click "+ ADD EVENT"
3. **Build Relationships** - Edit a venture and set a parent venture for branches
4. **Explore** - Use `P` for preview mode, `L` for list view, `S` for statistics

## Event Types

- **Launch** - Product or service launch
- **Funding** - Funding round or investment
- **Milestone** - Key achievement or milestone
- **Team** - Team member addition or hiring
- **Pivot** - Business pivot or direction change
- **Setback** - Challenges or setbacks
- **Exit** - Acquisition or exit event
- **Other** - General events

## Venture Status

- **Active** - Currently running venture
- **Pivot** - Pivoted from original direction
- **Paused** - Temporarily paused
- **Shutdown** - Closed down
- **Exited** - Acquired or successfully exited

## Tips

- Use **preview mode** (P) to hide editing panels for clean screenshots
- **Export regularly** to backup your data
- Use **statistics** (S) to see your venture portfolio at a glance
- **Double-click** ventures for quick editing
- Use **space + drag** to pan the canvas
- **Scroll** to zoom in and out

## Keyboard Controls

| Key | Action |
|-----|--------|
| `N` | New venture |
| `M` | Modify selected |
| `P` | Preview mode |
| `L` | Ventures list |
| `S` | Statistics |
| `?` | Help |
| `Space + Drag` | Pan canvas |
| `Scroll` | Zoom |

## Browser Support

Works best on modern browsers with WebGL support (Chrome, Firefox, Safari, Edge).

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Canvas**: PixiJS v8 (WebGL rendering)
- **State**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components

---

Made with PixiJS, React, and Next.js for entrepreneurs tracking their venture journey.
