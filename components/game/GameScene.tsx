"use client";

import { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import MazeRenderer from "./MazeRenderer";
import ExitMarker from "./ExitMarker";
import CameraRig from "./CameraRig";
import V3ktorAgent from "./V3ktorAgent";
import ClaudeAgent from "./ClaudeAgent";
import HUDOverlay from "@/components/hud/HUDOverlay";
import { generateMaze, getMazeExit } from "@/lib/maze/generator";
import { gridToWorld } from "@/lib/utils/three-helpers";
import { MAZE_COLS, MAZE_ROWS } from "@/lib/utils/constants";
import { coordinator } from "@/lib/agents/PathfindingCoordinator";
import { gameBus } from "@/lib/agents/MessageBus";
import { useGameStore } from "@/lib/store/gameStore";
import type { Grid } from "@/lib/maze/types";
import type { AgentStatus } from "@/lib/store/gameStore";

// Inner component that runs inside R3F Canvas context
function Scene({ grid }: { grid: Grid }) {
  const v3ktor = useGameStore((s) => s.v3ktor);
  const claude = useGameStore((s) => s.claude);

  const v3ktorVec = useRef(new THREE.Vector3(...v3ktor.position));
  const claudeVec = useRef(new THREE.Vector3(...claude.position));

  // Keep ref vecs in sync with store positions and drive coordinator tick
  useFrame((_, delta) => {
    v3ktorVec.current.set(...v3ktor.position);
    claudeVec.current.set(...claude.position);
    coordinator.update(delta);
  });

  const [exitCol, exitRow] = getMazeExit(MAZE_COLS, MAZE_ROWS);
  const exitWorldPos = gridToWorld(exitCol, exitRow);
  const exitPos: [number, number, number] = [exitWorldPos.x, 0.1, exitWorldPos.z];

  return (
    <>
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

        <V3ktorAgent
          position={v3ktor.position}
          rotation={v3ktor.rotation}
          isMoving={v3ktor.isMoving}
          message={v3ktor.message}
          messageTimestamp={v3ktor.messageTimestamp}
        />
        <ClaudeAgent
          position={claude.position}
          rotation={claude.rotation}
          isMoving={claude.isMoving}
          message={claude.message}
          messageTimestamp={claude.messageTimestamp}
        />

        <CameraRig targetA={v3ktorVec.current} targetB={claudeVec.current} />
      </Suspense>
    </>
  );
}

export default function GameScene() {
  const grid = useMemo(
    () => generateMaze({ cols: MAZE_COLS, rows: MAZE_ROWS, seed: 42 }),
    []
  );

  const setPhase = useGameStore((s) => s.setPhase);
  const setMaze = useGameStore((s) => s.setMaze);
  const setAgentPosition = useGameStore((s) => s.setAgentPosition);
  const setAgentStatus = useGameStore((s) => s.setAgentStatus);
  const setAgentMoving = useGameStore((s) => s.setAgentMoving);
  const speed = useGameStore((s) => s.speed);
  const resetGame = useGameStore((s) => s.resetGame);

  const [exitCol, exitRow] = getMazeExit(MAZE_COLS, MAZE_ROWS);

  // Wire gameBus events → Zustand store
  useEffect(() => {
    const onMessage = ({
      agent,
      message,
    }: {
      agent: "v3ktor" | "claude";
      message: string;
    }) => {
      const current = useGameStore.getState()[agent];
      setAgentStatus(agent, current.status, message);
    };

    const onStatus = ({
      agent,
      status,
    }: {
      agent: "v3ktor" | "claude";
      status: AgentStatus;
    }) => {
      setAgentStatus(agent, status);
    };

    const onPosition = ({
      agent,
      x,
      y,
      z,
      rotation,
    }: {
      agent: "v3ktor" | "claude";
      x: number;
      y: number;
      z: number;
      rotation: number;
    }) => {
      setAgentPosition(agent, [x, y, z], rotation);
      setAgentMoving(agent, true);
    };

    const onWon = () => {
      setPhase("won");
    };

    gameBus.on("agent:message", onMessage);
    gameBus.on("agent:status", onStatus);
    gameBus.on("agent:position", onPosition);
    gameBus.on("game:won", onWon);

    return () => {
      gameBus.off("agent:message", onMessage);
      gameBus.off("agent:status", onStatus);
      gameBus.off("agent:position", onPosition);
      gameBus.off("game:won", onWon);
    };
  }, [setPhase, setAgentPosition, setAgentStatus, setAgentMoving]);

  // Sync speed to coordinator
  useEffect(() => {
    coordinator.setSpeed(speed);
  }, [speed]);

  // Initialize maze in store on mount
  useEffect(() => {
    setMaze(grid);
  }, [grid, setMaze]);

  const handleStart = () => {
    setPhase("exploring");
    coordinator.init(grid, exitCol, exitRow);
    coordinator.start();
  };

  const handleReset = () => {
    coordinator.reset();
    resetGame();
    setMaze(grid);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{ position: [10, 20, 20], fov: 55, near: 0.1, far: 500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Scene grid={grid} />
      </Canvas>

      <HUDOverlay onStart={handleStart} onReset={handleReset} />
    </div>
  );
}
