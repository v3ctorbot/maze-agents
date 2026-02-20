"use client";

import { useGameStore } from "@/lib/store/gameStore";
import Badge from "@/components/ui/Badge";

interface Props {
  agent: "v3ktor" | "claude";
}

export default function AgentStatusCard({ agent }: Props) {
  const state = useGameStore((s) => s[agent]);
  const isV3ktor = agent === "v3ktor";

  const nameColor = isV3ktor ? "text-cyan-400" : "text-amber-400";
  const borderClass = isV3ktor ? "border-cyan-500/50" : "border-amber-500/50";
  const dotColor = isV3ktor ? "#06B6D4" : "#F59E0B";
  const dotGlow = isV3ktor ? "#06B6D4" : "#F59E0B";

  const showMessage =
    state.message && Date.now() - state.messageTimestamp < 6000;

  return (
    <div
      className={`hud-card ${borderClass}`}
      style={{ minWidth: 180 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{
            backgroundColor: dotColor,
            boxShadow: `0 0 6px ${dotGlow}`,
          }}
        />
        <span className={`text-sm font-bold tracking-wide ${nameColor}`}>
          {state.name}
        </span>
      </div>
      <Badge status={state.status} />
      {showMessage && (
        <div className="mt-2 text-xs text-slate-300 bg-slate-800/60 rounded px-2 py-1 leading-snug">
          &ldquo;{state.message}&rdquo;
        </div>
      )}
    </div>
  );
}
