import type { Grid, Direction } from "./types";
import { CELL_SIZE } from "@/lib/utils/constants";

const DELTA: Record<Direction, [number, number]> = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

export interface PathNode {
  col: number;
  row: number;
  worldX: number;
  worldZ: number;
}

export function findPath(
  grid: Grid,
  startCol: number,
  startRow: number,
  endCol: number,
  endRow: number
): PathNode[] {
  const rows = grid.length;
  const cols = grid[0].length;

  const key = (c: number, r: number) => `${c},${r}`;
  const visited = new Set<string>();
  const prev = new Map<string, string | null>();

  const queue: [number, number][] = [[startCol, startRow]];
  visited.add(key(startCol, startRow));
  prev.set(key(startCol, startRow), null);

  while (queue.length > 0) {
    const [col, row] = queue.shift()!;
    if (col === endCol && row === endRow) break;

    const cell = grid[row][col];
    const dirs: Direction[] = ["N", "S", "E", "W"];
    for (const dir of dirs) {
      if (cell.walls[dir]) continue;
      const [dc, dr] = DELTA[dir];
      const nc = col + dc;
      const nr = row + dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      const k = key(nc, nr);
      if (!visited.has(k)) {
        visited.add(k);
        prev.set(k, key(col, row));
        queue.push([nc, nr]);
      }
    }
  }

  // Reconstruct path from exit back to start
  const path: PathNode[] = [];
  let current: string | null = key(endCol, endRow);
  while (current !== null) {
    const [c, r] = current.split(",").map(Number);
    path.unshift({
      col: c,
      row: r,
      worldX: c * CELL_SIZE,
      worldZ: r * CELL_SIZE,
    });
    current = prev.get(current) ?? null;
  }

  return path;
}
