# CLAUDE.md — maze-agents

## Project Overview

- **Name:** maze-agents — browser 3D maze with V3ktor (teal) + Claude (amber) robots navigating together
- **Live:** https://maze-agents.vercel.app
- **Repo:** https://github.com/v3ctorbot/maze-agents
- **Owner:** v3ctorbot GitHub account (Fernando / V3ktor)
- **Local path:** `/Users/felmco/Documents/maze-agents`

---

## Stack & Versions

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.1.11 + React 19 + TypeScript 5.7 |
| 3D Engine | Three.js 0.183 + @react-three/fiber 9.5 + @react-three/drei 10.7 |
| State | Zustand 5 |
| Styling | Tailwind CSS 3 |
| Deploy | Vercel (team: v3ktors-projects) |

**Note:** Yuka.js is listed in `transpilePackages` but NOT used. The pathfinder is a custom BFS grid implementation.

---

## Critical Architectural Rules

1. **All Three.js / R3F components MUST have `"use client"` at the top** — they use browser APIs and cannot run server-side.

2. **`GameScene` must be loaded via `dynamic(() => ..., { ssr: false })`** — and that `dynamic()` call must live inside a `"use client"` component (`GameLoader.tsx`). Next.js 15 App Router does NOT allow `ssr: false` inside Server Components.

3. **`next.config.ts` has `transpilePackages: ['three', 'yuka']` and server-side externals for Three.js** — do not remove these or SSR will break.

4. **Wall geometry uses `InstancedMesh`** — 1 draw call for all walls. After calling `setMatrixAt()`, always set `instanceMatrix.needsUpdate = true`.

5. **Agent positions live in Zustand store** (single source of truth for React). `PathfindingCoordinator` publishes to `gameBus` → `GameScene.tsx` wires bus events to Zustand.

6. **Maze is deterministic** — seed=42 always produces the same layout. Start is always `[0,0]`, exit is always `[cols-1, rows-1]`.

---

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Server Component entry — imports `GameLoader` (NOT GameScene directly) |
| `components/game/GameLoader.tsx` | `"use client"` wrapper for `ssr: false` dynamic import |
| `components/game/GameScene.tsx` | Integration root — Canvas + HUD + gameBus wiring |
| `components/game/MazeRenderer.tsx` | InstancedMesh walls + PlaneGeometry floor |
| `components/game/AgentMesh.tsx` | Pure Three.js geometry robot with walk animation |
| `components/game/V3ktorAgent.tsx` | Teal robot wrapper |
| `components/game/ClaudeAgent.tsx` | Amber robot wrapper |
| `components/game/ExitMarker.tsx` | Animated torus portal |
| `components/game/CameraRig.tsx` | Camera that tracks midpoint between agents |
| `components/hud/HUDOverlay.tsx` | Composes status cards, controls, minimap, win screen |
| `lib/maze/generator.ts` | Recursive Backtracking maze (seeded RNG) |
| `lib/maze/pathfinder.ts` | BFS pathfinder — respects cell wall flags |
| `lib/agents/PathfindingCoordinator.ts` | 4-phase state machine (explore → validate → move → won) |
| `lib/agents/MessageBus.ts` | Typed pub/sub — `gameBus` singleton |
| `lib/store/gameStore.ts` | Zustand store: phase, agent positions/status/messages |
| `lib/utils/constants.ts` | CELL_SIZE=4, WALL_HEIGHT=3, AGENT_SPEED, agent colors |

---

## Dev Commands

```bash
npm run dev          # local dev → http://localhost:3000
npm run build        # production build (verifies no SSR leaks)
npx tsc --noEmit     # type-check only
```

---

## Deploy to Vercel

```bash
# .vercel/project.json must exist (already committed)
TOKEN=$(cat ~/.secrets/vercel-token.txt)
npx vercel --prod --yes --token="$TOKEN"
```

**Note:** Vercel CLI v50.x `--scope` flag is broken in non-interactive mode. Use `.vercel/project.json` to link the project instead.

---

## Dashboard & V3ktor

```bash
# Log work
node /Users/felmco/Documents/v3ktor-dashboard/scripts/v3ktor-cli.mjs log "action" "target" "success" '{}'

# Update task
node /Users/felmco/Documents/v3ktor-dashboard/scripts/v3ktor-cli.mjs task update "TASK-XXX" "done"

# Message V3ktor
openclaw agent --agent main --message "Your message here"
```

---

## Known Gotchas

- **`ssr: false` restriction** — `dynamic(() => import(...), { ssr: false })` must be inside a `"use client"` component, not a Server Component. This is a Next.js 15 App Router requirement.
- **`hemisphereLight` in R3F** — takes `args={[skyColor, groundColor, intensity]}` as an array prop, not individual props.
- **`InstancedMesh` matrix updates** — call `instanceMatrix.needsUpdate = true` after every `setMatrixAt()` or changes won't render.
- **`MessageBus` TypeScript constraint** — uses `Record<string, any>` (not `Record<string, unknown>`) to satisfy the generic. Has eslint-disable comment; do not change this.
- **Project location** — Must stay in `/Users/felmco/Documents/maze-agents`. Cannot be in `openClawTest` (capital letters violate npm package naming rules).
