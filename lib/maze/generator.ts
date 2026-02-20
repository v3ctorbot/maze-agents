import type { Cell, Grid, MazeConfig, Direction } from "./types";

const DIRS: Direction[] = ["N", "S", "E", "W"];

const OPPOSITE: Record<Direction, Direction> = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
};

const DELTA: Record<Direction, [number, number]> = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

function makeCell(): Cell {
  return {
    walls: { N: true, S: true, E: true, W: true },
    visited: false,
  };
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateMaze({ cols, rows, seed = 42 }: MazeConfig): Grid {
  const rng = seededRandom(seed);
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, makeCell)
  );

  const stack: [number, number][] = [];
  grid[0][0].visited = true;
  stack.push([0, 0]);

  while (stack.length > 0) {
    const [col, row] = stack[stack.length - 1];

    const neighbors: [Direction, number, number][] = [];
    for (const dir of DIRS) {
      const [dc, dr] = DELTA[dir];
      const nc = col + dc;
      const nr = row + dr;
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !grid[nr][nc].visited) {
        neighbors.push([dir, nc, nr]);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const idx = Math.floor(rng() * neighbors.length);
      const [dir, nc, nr] = neighbors[idx];
      grid[row][col].walls[dir] = false;
      grid[nr][nc].walls[OPPOSITE[dir]] = false;
      grid[nr][nc].visited = true;
      stack.push([nc, nr]);
    }
  }

  return grid;
}

export function getMazeStart(): [number, number] {
  return [0, 0];
}

export function getMazeExit(cols: number, rows: number): [number, number] {
  return [cols - 1, rows - 1];
}
