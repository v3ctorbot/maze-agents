"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import MazeRenderer from "./MazeRenderer";
import ExitMarker from "./ExitMarker";
import CameraRig from "./CameraRig";
import { generateMaze, getMazeExit } from "@/lib/maze/generator";
import { gridToWorld } from "@/lib/utils/three-helpers";
import { MAZE_COLS, MAZE_ROWS } from "@/lib/utils/constants";

export default function GameScene() {
  const grid = useMemo(
    () => generateMaze({ cols: MAZE_COLS, rows: MAZE_ROWS, seed: 42 }),
    []
  );

  const [exitCol, exitRow] = getMazeExit(MAZE_COLS, MAZE_ROWS);
  const exitWorldPos = gridToWorld(exitCol, exitRow);
  const exitPos: [number, number, number] = [exitWorldPos.x, 0.1, exitWorldPos.z];

  const startVec = useMemo(() => gridToWorld(0, 0), []);
  const exitVec = useMemo(() => exitWorldPos.clone(), []);

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [10, 20, 20], fov: 55, near: 0.1, far: 500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#0b1121"]} />
        <fog attach="fog" args={["#0b1121", 60, 130]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 30, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <hemisphereLight args={["#1e293b", "#0b1121", 0.5]} />

        <Suspense fallback={null}>
          <MazeRenderer grid={grid} />
          <ExitMarker position={exitPos} />
          <CameraRig targetA={startVec} targetB={exitVec} />
        </Suspense>
      </Canvas>
    </div>
  );
}
