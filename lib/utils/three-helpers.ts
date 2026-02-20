import * as THREE from "three";
import { CELL_SIZE } from "./constants";

export function gridToWorld(col: number, row: number): THREE.Vector3 {
  return new THREE.Vector3(col * CELL_SIZE, 0, row * CELL_SIZE);
}

export function worldToGrid(x: number, z: number): [number, number] {
  return [Math.round(x / CELL_SIZE), Math.round(z / CELL_SIZE)];
}
