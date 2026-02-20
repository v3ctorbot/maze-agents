"use client";

// Stub — full implementation lives in feature/maze-engine
export default function GameScene() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0b1121]">
      <div className="text-center space-y-4">
        <h1 className="text-cyan-400 text-3xl font-bold tracking-widest">
          MAZE AGENTS
        </h1>
        <p className="text-slate-400 text-sm">V3ktor &amp; Claude — AI Collaboration Demo</p>
        <p className="text-slate-600 text-xs">3D environment initializing…</p>
      </div>
    </div>
  );
}
