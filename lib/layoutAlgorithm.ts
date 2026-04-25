import { Venture } from './useStore';

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutResult {
  positions: Map<string, NodePosition>;
  trunkX: number;
  yearPositions: Map<number, number>;
}

const YEAR_HEIGHT = 900; // pixels per year (was 600, now 1.5x)
const NODE_WIDTH = 300; // was 200
const NODE_HEIGHT = 120; // was 80
const HORIZONTAL_SPACING = 270; // was 180
const TRUNK_X = 400; // x position of the main trunk

export function calculateLayout(ventures: Venture[]): LayoutResult {
  const positions = new Map<string, NodePosition>();
  const yearPositions = new Map<number, number>();

  // Find year range
  const dates = ventures.map((v) => new Date(v.startedDate));
  const minYear = Math.min(...dates.map((d) => d.getFullYear()));
  const maxYear = Math.max(...dates.map((d) => d.getFullYear()));

  // Calculate year label positions
  let currentY = 0;
  for (let year = minYear; year <= maxYear; year++) {
    yearPositions.set(year, currentY);
    currentY += YEAR_HEIGHT;
  }

  // Separate root ventures from branches
  const rootVentures = ventures.filter((v) => !v.parentId);
  const branches = ventures.filter((v) => v.parentId);

  // Position root ventures (alternating left/right)
  let leftX = TRUNK_X - HORIZONTAL_SPACING - NODE_WIDTH;
  let rightX = TRUNK_X + HORIZONTAL_SPACING;

  rootVentures.forEach((venture, index) => {
    const date = new Date(venture.startedDate);
    const year = date.getFullYear();
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(year, 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const yearProgress = dayOfYear / 365;

    const yearY = yearPositions.get(year) || 0;
    const y = yearY + yearProgress * YEAR_HEIGHT - NODE_HEIGHT / 2;

    if (index % 2 === 0) {
      // Left side (even indices)
      positions.set(venture.id, {
        x: leftX,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    } else {
      // Right side (odd indices)
      positions.set(venture.id, {
        x: rightX,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    }
  });

  // Position branches off their parent
  branches.forEach((branch) => {
    const parent = ventures.find((v) => v.id === branch.parentId);
    if (!parent) return;

    const parentPos = positions.get(parent.id);
    if (!parentPos) return;

    // Place branch to the right of parent, slightly offset
    const date = new Date(branch.startedDate);
    const year = date.getFullYear();
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(year, 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const yearProgress = dayOfYear / 365;

    const yearY = yearPositions.get(year) || 0;
    const y = yearY + yearProgress * YEAR_HEIGHT - NODE_HEIGHT / 2;

    positions.set(branch.id, {
      x: parentPos.x + NODE_WIDTH + 120,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  return {
    positions,
    trunkX: TRUNK_X,
    yearPositions,
  };
}
