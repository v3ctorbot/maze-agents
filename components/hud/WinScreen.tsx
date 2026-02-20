"use client";

import { useGameStore } from "@/lib/store/gameStore";

interface Props {
  onReset: () => void;
}

export default function WinScreen({ onReset }: Props) {
  const phase = useGameStore((s) => s.phase);
  if (phase !== "won") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50">
      <div className="hud-card border-cyan-500/50 text-center space-y-4 px-8 py-6 max-w-sm">
        <div className="text-4xl">
          <span style={{ color: "#06B6D4" }}>V3</span>
          <span style={{ color: "#F59E0B" }}>C</span>
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 tracking-wider">
          MAZE CLEARED!
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          V3ktor and Claude navigated the maze together through coordinated
          pathfinding. Multi-agent collaboration: successful.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button className="btn btn-primary" onClick={onReset}>
            ↺ Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
