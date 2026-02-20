"use client";

import AgentStatusCard from "./AgentStatusCard";
import GameControls from "./GameControls";
import MiniMap from "./MiniMap";
import WinScreen from "./WinScreen";

interface Props {
  onStart: () => void;
  onReset: () => void;
}

export default function HUDOverlay({ onStart, onReset }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top row: agent cards + title */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-start px-4">
        <div className="pointer-events-auto">
          <AgentStatusCard agent="v3ktor" />
        </div>

        <div className="flex flex-col items-center pt-1">
          <span className="text-cyan-400/70 text-xs tracking-[0.3em] uppercase font-mono">
            Maze Agents
          </span>
          <span className="text-slate-600 text-xs font-mono">
            V3ktor × Claude
          </span>
        </div>

        <div className="pointer-events-auto">
          <AgentStatusCard agent="claude" />
        </div>
      </div>

      {/* Bottom center: game controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="pointer-events-auto">
          <GameControls onStart={onStart} onReset={onReset} />
        </div>
      </div>

      {/* Bottom right: minimap */}
      <div className="absolute bottom-6 right-4 pointer-events-auto">
        <MiniMap />
      </div>

      {/* Win overlay */}
      <WinScreen onReset={onReset} />
    </div>
  );
}
