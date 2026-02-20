export type Direction = "N" | "S" | "E" | "W";

export interface Cell {
  walls: Record<Direction, boolean>;
  visited: boolean;
}

export type Grid = Cell[][];

export interface MazeConfig {
  cols: number;
  rows: number;
  seed?: number;
}
