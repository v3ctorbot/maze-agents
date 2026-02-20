import type { Grid } from "@/lib/maze/types";
import { findPath, type PathNode } from "@/lib/maze/pathfinder";
import { gameBus } from "./MessageBus";
import { CELL_SIZE, AGENT_SPEED } from "@/lib/utils/constants";

type Phase = "idle" | "exploring" | "validating" | "moving" | "arrived";

interface AgentWalker {
  name: "v3ktor" | "claude";
  col: number;
  row: number;
  x: number;
  z: number;
  path: PathNode[];
  pathIndex: number;
  speed: number;
  isMoving: boolean;
}

export class PathfindingCoordinator {
  private phase: Phase = "idle";
  private grid: Grid | null = null;
  private v3ktor: AgentWalker;
  private claude: AgentWalker;
  private exitCol = 0;
  private exitRow = 0;
  private gameSpeed = 1;

  constructor() {
    this.v3ktor = this.makeWalker("v3ktor", 0, 0);
    this.claude = this.makeWalker("claude", 0, 0);
  }

  private makeWalker(
    name: "v3ktor" | "claude",
    col: number,
    row: number
  ): AgentWalker {
    return {
      name,
      col,
      row,
      x: col * CELL_SIZE,
      z: row * CELL_SIZE,
      path: [],
      pathIndex: 0,
      speed: AGENT_SPEED,
      isMoving: false,
    };
  }

  private emit(agent: "v3ktor" | "claude", message: string) {
    gameBus.emit("agent:message", { agent, message });
  }

  private setStatus(
    agent: "v3ktor" | "claude",
    status: "idle" | "thinking" | "communicating" | "moving" | "arrived"
  ) {
    gameBus.emit("agent:status", { agent, status });
  }

  private emitPosition(walker: AgentWalker) {
    const target = walker.path[walker.pathIndex];
    const dx = target ? target.worldX - walker.x : 0;
    const dz = target ? target.worldZ - walker.z : 0;
    const rotation = dx !== 0 || dz !== 0 ? Math.atan2(dx, dz) : 0;

    gameBus.emit("agent:position", {
      agent: walker.name,
      x: walker.x,
      y: 0,
      z: walker.z,
      rotation,
    });
  }

  init(grid: Grid, exitCol: number, exitRow: number) {
    this.grid = grid;
    this.exitCol = exitCol;
    this.exitRow = exitRow;
    this.v3ktor = this.makeWalker("v3ktor", 0, 0);
    // Claude starts slightly offset so they don't overlap
    this.claude = this.makeWalker("claude", 1, 0);
    this.phase = "idle";
  }

  setSpeed(speed: number) {
    this.gameSpeed = speed;
  }

  async start() {
    if (!this.grid) return;

    // Phase 1 — Claude explores and finds path
    this.phase = "exploring";
    this.setStatus("claude", "thinking");
    this.emit("claude", "Calculating optimal path...");
    await this.delay(800);

    const claudePath = findPath(
      this.grid,
      this.claude.col,
      this.claude.row,
      this.exitCol,
      this.exitRow
    );

    this.setStatus("claude", "communicating");
    this.emit("claude", `Path found — ${claudePath.length} waypoints`);
    await this.delay(900);

    // Phase 2 — V3ktor validates
    this.phase = "validating";
    this.setStatus("v3ktor", "thinking");
    this.emit("v3ktor", "Running path validation...");
    await this.delay(700);

    const v3ktorPath = findPath(
      this.grid,
      this.v3ktor.col,
      this.v3ktor.row,
      this.exitCol,
      this.exitRow
    );

    const diff = Math.abs(claudePath.length - v3ktorPath.length);
    this.setStatus("v3ktor", "communicating");
    this.emit("v3ktor", diff <= 2 ? "Path validated. Let's go!" : "Route confirmed. Moving.");
    await this.delay(700);

    // Phase 3 — Both agents move
    this.phase = "moving";
    this.claude.path = claudePath;
    this.claude.pathIndex = 0;
    this.v3ktor.path = v3ktorPath;
    this.v3ktor.pathIndex = 0;
    this.setStatus("claude", "moving");
    this.setStatus("v3ktor", "moving");
  }

  update(delta: number) {
    if (this.phase !== "moving") return;

    const dt = delta * this.gameSpeed;
    const claudeDone = this.stepWalker(this.claude, dt);
    const v3ktorDone = this.stepWalker(this.v3ktor, dt);

    if (claudeDone && v3ktorDone && this.phase === "moving") {
      this.phase = "arrived";
      this.setStatus("claude", "arrived");
      this.setStatus("v3ktor", "arrived");
      this.emit("claude", "We made it!");
      this.emit("v3ktor", "Mission complete!");
      setTimeout(() => gameBus.emit("game:won", {}), 800);
    }
  }

  private stepWalker(walker: AgentWalker, dt: number): boolean {
    if (walker.pathIndex >= walker.path.length) {
      walker.isMoving = false;
      return true;
    }

    const target = walker.path[walker.pathIndex];
    const dx = target.worldX - walker.x;
    const dz = target.worldZ - walker.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const step = walker.speed * dt;

    if (dist <= step) {
      walker.x = target.worldX;
      walker.z = target.worldZ;
      walker.col = target.col;
      walker.row = target.row;
      walker.pathIndex++;
      walker.isMoving = walker.pathIndex < walker.path.length;
    } else {
      walker.x += (dx / dist) * step;
      walker.z += (dz / dist) * step;
      walker.isMoving = true;
    }

    this.emitPosition(walker);
    return walker.pathIndex >= walker.path.length;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(resolve, ms / this.gameSpeed)
    );
  }

  reset() {
    this.phase = "idle";
    this.v3ktor = this.makeWalker("v3ktor", 0, 0);
    this.claude = this.makeWalker("claude", 1, 0);
    this.setStatus("v3ktor", "idle");
    this.setStatus("claude", "idle");
  }
}

export const coordinator = new PathfindingCoordinator();
