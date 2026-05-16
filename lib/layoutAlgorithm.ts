import { Venture } from './useStore';

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  stemHeight?: number; // Height of the vertical stem from timeline to card
}

interface LayoutResult {
  positions: Map<string, NodePosition>;
  timelineY: number;
  yearPositions: Map<number, number>; // X position for each year
}

const MONTH_WIDTH = 120; // pixels per month
const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const TIMELINE_Y = Math.floor(typeof window !== 'undefined' ? window.innerHeight * 0.42 : 400); 
const STEM_HEIGHT_BASE = 36; // base stem length (per spec)
const STEM_OVERLAP_OFFSET = 120; // increased offset for larger cards

// Reference date for all calculations
const REFERENCE_DATE = new Date('2024-01-01');

export function calculateLayout(ventures: Venture[]): LayoutResult {
  const positions = new Map<string, NodePosition>();
  const yearPositions = new Map<number, number>();

  // Calculate X position (months since reference date)
  function dateToX(dateStr: string): number {
    const date = new Date(dateStr);
    const months =
      (date.getFullYear() - REFERENCE_DATE.getFullYear()) * 12 +
      (date.getMonth() - REFERENCE_DATE.getMonth());
    const dayOfMonth = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const dayProgress = dayOfMonth / daysInMonth;

    return months * MONTH_WIDTH + dayProgress * MONTH_WIDTH;
  }

  // Build a stable axis from 2022-2026 so navigation and empty years remain visible.
  const allYears = new Set<number>([2022, 2023, 2024, 2025, 2026]);
  ventures.forEach((v) => {
    allYears.add(new Date(v.startedDate).getFullYear());
  });

  Array.from(allYears)
    .sort()
    .forEach((year) => {
      const xPos = dateToX(`${year}-01-01`);
      yearPositions.set(year, xPos);
    });

  // Separate root and branch ventures
  const rootVentures = ventures.filter((v) => !v.parentId);
  const branches = ventures.filter((v) => v.parentId);

  // Position root ventures
  const rootPositions = new Map<string, { x: number; stemLevel: number; side: 'above' | 'below' }>();

  rootVentures.forEach((venture) => {
    const x = venture.position?.x ?? dateToX(venture.startedDate);
    const side = venture.timelineSide || 'below';

    // Detect overlaps with other ventures at similar X positions
    let stemLevel = 0;
    let overlap = true;
    while (overlap) {
      overlap = false;
      const currentStemHeight = STEM_HEIGHT_BASE + stemLevel * STEM_OVERLAP_OFFSET;
      const currentY =
        side === 'above'
          ? TIMELINE_Y - currentStemHeight - NODE_HEIGHT - 20
          : TIMELINE_Y + currentStemHeight;
      const currentCardBottom = currentY + NODE_HEIGHT;

      // Check if this position overlaps with any other positioned venture
      rootPositions.forEach((pos) => {
        const otherStemHeight = STEM_HEIGHT_BASE + pos.stemLevel * STEM_OVERLAP_OFFSET;
        const otherY =
          pos.side === 'above'
            ? TIMELINE_Y - otherStemHeight - NODE_HEIGHT - 20
            : TIMELINE_Y + otherStemHeight;
        const otherCardBottom = otherY + NODE_HEIGHT;

        // Cards overlap if X ranges overlap and Y ranges overlap
        const xOverlap = Math.abs(x - pos.x) < NODE_WIDTH + 20; // 20px tolerance
        const yOverlap = !(currentCardBottom < otherY || currentY > otherCardBottom);

        if (xOverlap && yOverlap) {
          overlap = true;
        }
      });

      if (overlap) stemLevel++;
    }

    const stemHeight = STEM_HEIGHT_BASE + stemLevel * STEM_OVERLAP_OFFSET;
    const y = venture.position?.y ?? (side === 'above' ? TIMELINE_Y - stemHeight - NODE_HEIGHT - 20 : TIMELINE_Y + stemHeight);

    const actualStemHeight = venture.position
      ? y < TIMELINE_Y
        ? -(TIMELINE_Y - (y + NODE_HEIGHT + 20))
        : y - TIMELINE_Y
      : side === 'above' ? -stemHeight : stemHeight;

    positions.set(venture.id, {
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      stemHeight: actualStemHeight,
    });

    rootPositions.set(venture.id, { x, stemLevel, side });
  });

  // Position branch ventures
  branches.forEach((branch) => {
    const parent = ventures.find((v) => v.id === branch.parentId);
    if (!parent) return;

    const parentPos = positions.get(parent.id);
    if (!parentPos) return;

    // Position to the right and below parent
    const x = parentPos.x + NODE_WIDTH + 60; // 60px to the right

    // Position below parent with some vertical offset
    let stemLevel = 0;
    let overlap = true;
    while (overlap) {
      overlap = false;
      const currentStemHeight = STEM_HEIGHT_BASE + stemLevel * STEM_OVERLAP_OFFSET;
      const currentY = TIMELINE_Y + currentStemHeight + NODE_HEIGHT;
      const currentCardBottom = currentY + NODE_HEIGHT;

      // Check overlap with all positioned ventures
      positions.forEach((pos) => {
        if (pos.stemHeight === undefined) return;

        const otherY = pos.y;
        const otherCardBottom = otherY + NODE_HEIGHT;

        const xOverlap = Math.abs(x - pos.x) < NODE_WIDTH + 20;
        const yOverlap = !(currentCardBottom < otherY || currentY > otherCardBottom);

        if (xOverlap && yOverlap) {
          overlap = true;
        }
      });

      if (overlap) stemLevel++;
    }

    const stemHeight = STEM_HEIGHT_BASE + stemLevel * STEM_OVERLAP_OFFSET;
    const y = TIMELINE_Y + stemHeight + NODE_HEIGHT;

    positions.set(branch.id, {
      x,
      y: y - NODE_HEIGHT, // Top of card
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      stemHeight,
    });
  });

  return {
    positions,
    timelineY: TIMELINE_Y,
    yearPositions,
  };
}
