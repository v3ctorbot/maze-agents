"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { CELL_SIZE } from "@/lib/utils/constants";

const MINI = 4;

export default function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maze = useGameStore((s) => s.maze);
  const v3ktor = useGameStore((s) => s.v3ktor);
  const claude = useGameStore((s) => s.claude);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !maze) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = maze.length;
    const cols = maze[0].length;
    canvas.width = cols * MINI;
    canvas.height = rows * MINI;

    ctx.fillStyle = "#0b1121";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 0.5;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = maze[row][col];
        const x = col * MINI;
        const y = row * MINI;

        if (cell.walls.N) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + MINI, y); ctx.stroke();
        }
        if (cell.walls.W) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + MINI); ctx.stroke();
        }
        if (row === rows - 1 && cell.walls.S) {
          ctx.beginPath(); ctx.moveTo(x, y + MINI); ctx.lineTo(x + MINI, y + MINI); ctx.stroke();
        }
        if (col === cols - 1 && cell.walls.E) {
          ctx.beginPath(); ctx.moveTo(x + MINI, y); ctx.lineTo(x + MINI, y + MINI); ctx.stroke();
        }
      }
    }

    // Exit marker
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect((cols - 1) * MINI + 1, (rows - 1) * MINI + 1, MINI - 2, MINI - 2);

    // Agent dots
    const dot = (pos: [number, number, number], color: string) => {
      const ax = (pos[0] / CELL_SIZE) * MINI + MINI / 2;
      const ay = (pos[2] / CELL_SIZE) * MINI + MINI / 2;
      ctx.beginPath();
      ctx.arc(ax, ay, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    dot(v3ktor.position, "#06b6d4");
    dot(claude.position, "#f59e0b");
  }, [maze, v3ktor.position, claude.position]);

  if (!maze) return null;

  return (
    <div className="hud-card p-2">
      <div className="text-xs text-slate-500 mb-1 text-center">Map</div>
      <canvas ref={canvasRef} style={{ imageRendering: "pixelated", display: "block" }} />
    </div>
  );
}
