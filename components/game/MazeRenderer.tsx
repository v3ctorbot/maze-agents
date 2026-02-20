"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { Grid } from "@/lib/maze/types";
import {
  CELL_SIZE,
  WALL_HEIGHT,
  WALL_THICKNESS,
  WALL_COLOR,
  FLOOR_COLOR,
} from "@/lib/utils/constants";

interface WallSpec {
  position: [number, number, number];
  scale: [number, number, number];
}

function buildWallSpecs(grid: Grid): WallSpec[] {
  const specs: WallSpec[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      const x = col * CELL_SIZE;
      const z = row * CELL_SIZE;
      const half = CELL_SIZE / 2;
      const y = WALL_HEIGHT / 2;

      if (cell.walls.N) {
        specs.push({
          position: [x, y, z - half],
          scale: [CELL_SIZE + WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS],
        });
      }
      if (cell.walls.W) {
        specs.push({
          position: [x - half, y, z],
          scale: [WALL_THICKNESS, WALL_HEIGHT, CELL_SIZE + WALL_THICKNESS],
        });
      }
      if (row === rows - 1 && cell.walls.S) {
        specs.push({
          position: [x, y, z + half],
          scale: [CELL_SIZE + WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS],
        });
      }
      if (col === cols - 1 && cell.walls.E) {
        specs.push({
          position: [x + half, y, z],
          scale: [WALL_THICKNESS, WALL_HEIGHT, CELL_SIZE + WALL_THICKNESS],
        });
      }
    }
  }
  return specs;
}

interface Props {
  grid: Grid;
}

export default function MazeRenderer({ grid }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const rows = grid.length;
  const cols = grid[0].length;
  const floorWidth = cols * CELL_SIZE;
  const floorDepth = rows * CELL_SIZE;
  const floorX = ((cols - 1) * CELL_SIZE) / 2;
  const floorZ = ((rows - 1) * CELL_SIZE) / 2;

  const wallSpecs = useMemo(() => buildWallSpecs(grid), [grid]);

  // Build instance matrices
  useMemo(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    wallSpecs.forEach((spec, i) => {
      dummy.position.set(...spec.position);
      dummy.scale.set(...spec.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [wallSpecs]);

  return (
    <group>
      {/* Floor */}
      <mesh
        position={[floorX, -0.05, floorZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[floorWidth + WALL_THICKNESS, floorDepth + WALL_THICKNESS]}
        />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Walls — instanced for O(1) draw calls */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, wallSpecs.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.6} metalness={0.3} />
      </instancedMesh>
    </group>
  );
}
