import { create } from "zustand";
import type { Grid } from "@/lib/maze/types";

export type GamePhase =
  | "idle"
  | "generating"
  | "exploring"
  | "validating"
  | "moving"
  | "won";

export type AgentStatus =
  | "idle"
  | "thinking"
  | "communicating"
  | "moving"
  | "arrived";

export interface AgentState {
  name: string;
  position: [number, number, number];
  rotation: number;
  status: AgentStatus;
  message: string | null;
  messageTimestamp: number;
  isMoving: boolean;
}

interface GameStore {
  phase: GamePhase;
  maze: Grid | null;
  speed: number;
  v3ktor: AgentState;
  claude: AgentState;

  setPhase: (phase: GamePhase) => void;
  setMaze: (maze: Grid) => void;
  setSpeed: (speed: number) => void;
  setAgentPosition: (
    agent: "v3ktor" | "claude",
    pos: [number, number, number],
    rotation?: number
  ) => void;
  setAgentStatus: (
    agent: "v3ktor" | "claude",
    status: AgentStatus,
    message?: string | null
  ) => void;
  setAgentMoving: (agent: "v3ktor" | "claude", moving: boolean) => void;
  resetGame: () => void;
}

const defaultV3ktor: AgentState = {
  name: "V3ktor",
  position: [0, 0, 0],
  rotation: 0,
  status: "idle",
  message: null,
  messageTimestamp: 0,
  isMoving: false,
};

const defaultClaude: AgentState = {
  name: "Claude",
  position: [4, 0, 0],
  rotation: 0,
  status: "idle",
  message: null,
  messageTimestamp: 0,
  isMoving: false,
};

export const useGameStore = create<GameStore>((set) => ({
  phase: "idle",
  maze: null,
  speed: 1,
  v3ktor: { ...defaultV3ktor },
  claude: { ...defaultClaude },

  setPhase: (phase) => set({ phase }),
  setMaze: (maze) => set({ maze }),
  setSpeed: (speed) => set({ speed }),

  setAgentPosition: (agent, pos, rotation) =>
    set((s) => ({
      [agent]: {
        ...s[agent],
        position: pos,
        ...(rotation !== undefined ? { rotation } : {}),
      },
    })),

  setAgentStatus: (agent, status, message = null) =>
    set((s) => ({
      [agent]: {
        ...s[agent],
        status,
        message,
        messageTimestamp: message ? Date.now() : s[agent].messageTimestamp,
      },
    })),

  setAgentMoving: (agent, moving) =>
    set((s) => ({ [agent]: { ...s[agent], isMoving: moving } })),

  resetGame: () =>
    set({
      phase: "idle",
      maze: null,
      v3ktor: { ...defaultV3ktor },
      claude: { ...defaultClaude },
    }),
}));
