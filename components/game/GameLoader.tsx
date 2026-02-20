"use client";

import dynamic from "next/dynamic";

// Three.js / WebGL is browser-only — load with ssr: false inside a client component
const GameScene = dynamic(() => import("./GameScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#0b1121]">
      <div className="text-center space-y-3">
        <div className="text-cyan-400 text-2xl font-bold tracking-wider">
          MAZE AGENTS
        </div>
        <div className="text-slate-400 text-sm animate-pulse">
          Loading 3D environment…
        </div>
      </div>
    </div>
  ),
});

export default function GameLoader() {
  return <GameScene />;
}
