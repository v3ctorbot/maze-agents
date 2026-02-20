# Maze Agents

> A browser-based 3D maze game where V3ktor and Claude navigate together — a live demo of multi-agent AI collaboration.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## What Is This?

Two AI robot characters — **V3ktor** (teal) and **Claude** (amber) — navigate a procedurally generated 3D maze together, demonstrating a real multi-agent coordination pattern:

1. **Claude** computes the optimal path using BFS graph search
2. **Claude** broadcasts the route to **V3ktor** via the message bus
3. **V3ktor** independently validates the route
4. **Both agents** move in parallel toward the exit

Speech bubbles, HUD status cards, and a minimap make the collaboration visible in real time.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.1 + React 19 + TypeScript |
| 3D Engine | Three.js 0.183 + React Three Fiber 9.5 |
| 3D Helpers | @react-three/drei 10.7 |
| State | Zustand 5 |
| Styling | Tailwind CSS 3 |
| Deploy | Vercel |

---

## How It Works

```
GameScene (React + R3F)
    │
    ├── PathfindingCoordinator   ← State machine: explore → validate → move → won
    │       │
    │       ├── findPath()       ← BFS through maze grid (respects walls)
    │       └── gameBus          ← Typed pub/sub: agent:message, agent:position, game:won
    │
    ├── Zustand store            ← Single source of truth for agent position/status
    │
    ├── MazeRenderer             ← InstancedMesh walls (1 draw call), PlaneGeometry floor
    ├── V3ktorAgent              ← Cyan robot with walking animation + speech bubble
    ├── ClaudeAgent              ← Amber robot with walking animation + speech bubble
    ├── ExitMarker               ← Animated cyan torus portal
    └── HUDOverlay               ← Status cards, game controls, minimap, win screen
```

The maze is generated with the **Recursive Backtracking** algorithm (seeded RNG for reproducibility). Every run on seed=42 produces the same maze layout.

---

## Local Development

```bash
git clone https://github.com/v3ctorbot/maze-agents
cd maze-agents
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **▶ Start** to watch V3ktor and Claude navigate.

**Requirements:** Node.js 18+

---

## Controls

| Action | What happens |
|--------|-------------|
| **▶ Start** | Agents begin pathfinding sequence |
| **2× Speed** | Doubles agent movement speed |
| **↺ Reset** | Resets state, agents return to start |

---

## Project Structure

```
components/
  game/         # Three.js / R3F scene components
  hud/          # HTML overlay: status cards, controls, minimap, win screen
  ui/           # Reusable badge component
lib/
  maze/         # Maze generator (Recursive Backtracking) + BFS pathfinder
  agents/       # PathfindingCoordinator, MessageBus
  store/        # Zustand game store
  utils/        # Constants, Three.js helpers
```

---

## Agent Collaboration Model

This project demonstrates the same coordination pattern used by the Future Tales agent system:

- **V3ktor** (strategy/validation) and **Claude** (execution/pathfinding) have distinct roles
- They communicate via a typed `MessageBus` (async pub/sub)
- Neither agent directly mutates the other's state — all coordination goes through events
- A shared Zustand store provides the single source of truth for the React render layer

---

## Branches

| Branch | Content |
|--------|---------|
| `main` | Integrated game |
| `feature/maze-engine` | Maze generator + Three.js renderer |
| `feature/characters` | V3ktor + Claude robot meshes |
| `feature/pathfinding` | BFS pathfinder + coordinator state machine |
| `feature/ui-hud` | Zustand store + HUD overlay |
| `feature/deploy` | README + Vercel config |

---

Built by **V3ktor** + **Claude** for [Future Tales](https://github.com/v3ctorbot).
