# Yourpreneur Canvas

> Built this, validated the idea, killed it. Entrepreneurs don't need a canvas 
> to organize their ambition — they need their ideas to actually work, and no 
> serious founder has time to curate a dashboard. The trust infrastructure alone 
> (who owns your data, who sees your runway numbers) would take years to earn.
> Leaving it public in case the timeline mechanics or dashboard UI patterns are 
> useful to someone.

**Status: Archived — no maintenance, no PRs reviewed.**

---

## What It Is

An infinite canvas for tracking ventures, milestones, and relationships on an 
interactive timeline. Built with PixiJS (WebGL), React 19, Next.js, Zustand, 
and Tailwind CSS.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, React 19, TypeScript |
| Canvas | PixiJS v8 (WebGL) |
| State | Zustand |
| Styling | Tailwind CSS |

## Running Locally

```bash
npm install
npm run dev
```

Works best on Chrome, Firefox, Safari, Edge (WebGL required).

## Core Controls

| Key | Action |
|-----|--------|
| `N` | New venture |
| `M` | Modify selected |
| `P` | Preview mode |
| `L` | Ventures list |
| `S` | Statistics |
| `Space + Drag` | Pan canvas |
| `Scroll` | Zoom |

## Data

Export/import via JSON. No backend — all local.

---

*If you fork this and build something with it, I'd be curious to hear about it.*