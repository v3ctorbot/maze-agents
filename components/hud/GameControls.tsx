"use client";

import { useGameStore } from "@/lib/store/gameStore";

interface Props {
  onStart: () => void;
  onReset: () => void;
}

export default function GameControls({ onStart, onReset }: Props) {
  const phase = useGameStore((s) => s.phase);
  const speed = useGameStore((s) => s.speed);
  const setSpeed = useGameStore((s) => s.setSpeed);

  const canStart = phase === "idle";
  const isRunning = phase !== "idle" && phase !== "won";

  return (
    <div className="flex items-center gap-2">
      {canStart && (
        <button className="btn btn-primary" onClick={onStart}>
          ▶ Start
        </button>
      )}
      {isRunning && (
        <button
          className="btn btn-secondary"
          onClick={() => setSpeed(speed === 1 ? 2 : 1)}
        >
          {speed === 1 ? "2× Speed" : "1× Speed"}
        </button>
      )}
      {phase !== "idle" && (
        <button className="btn btn-danger" onClick={onReset}>
          ↺ Reset
        </button>
      )}
    </div>
  );
}
