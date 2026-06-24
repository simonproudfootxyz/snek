# Snek Developer Handoff

## Audience and Scope

This document is for senior frontend engineers and technical leads taking ownership of the Snek codebase. It covers architecture, runtime flow, engine behavior, extension points, and operational notes.

## High-Level Architecture

Snek is a Next.js App Router application with a thin page shell and a client-side game runtime.

- App shell:
  - `src/app/layout.tsx` defines global layout, metadata, and fonts.
  - `src/app/page.tsx` renders static page chrome and mounts `GameClient`.
- Game runtime:
  - `src/features/game/components/GameClient.tsx` is the orchestration root.
  - Uses `useReducer` for game state transitions and action dispatch.
  - Uses `useGameLoop` for deterministic tick cadence.
- Engine layer (pure logic):
  - `src/features/game/engine/*` contains state modeling, spawn rules, collision, scoring, and tick updates.
- Input layer:
  - Keyboard: `useKeyboardInput`.
  - Touch swipe: `useSwipeInput`.
  - Mobile D-pad: `GameTouchControls`.
- Rendering layer:
  - Canvas renderer in `GameCanvas` draws grid, snake, structures, and items each state change.

## Key Runtime Flow

1. `GameClient` initializes state with `createInitialState`.
2. A requestAnimationFrame loop (`useGameLoop`) dispatches `tick` using `msPerTick = ticksPerMove * 40`.
3. `tick` actions flow through reducer -> `tickGame`.
4. `tickGame` sequence:
   - resolve direction
   - move snake head
   - apply boundary and structure collision
   - detect item collection
   - update snake length, score, and speed
   - expire timed items
   - respawn items via spawning policy functions
5. Canvas re-renders from current state.

## State Model

Defined in `src/features/game/engine/types.ts`.

- `GameState` contains:
  - phase (`idle | running | paused | gameover`)
  - score/highScore
  - timing (`tick`, `ticksPerMove`)
  - movement (`direction`, `queuedDirection`)
  - board entities (`snake`, `items`, `structures`)
  - RNG (`rngSeed`)
  - difficulty + settings
- `Item` supports lifecycle metadata:
  - `expiresAtTick` for time-based expiration
  - `expiresAtGoodCount` for progress-based expiration (currently used for red hazards)

## Item and Hazard System

Current values are driven by `src/features/game/engine/constants.ts` and enforced in `src/features/game/engine/updateGame.ts`.

- Green (`good`):
  - +10 points
  - Max 3 total
  - 1 static + up to 2 timed variants
- Blue (`bonus`):
  - +20 points
  - Max 2 timed instances
- Yellow (`yellow`):
  - -5 points and shortens snake by 1
  - Max 2 total
  - 1 static + 1 timed
- Red (`bad`):
  - Instant game over on collect
  - Spawn pressure ramps over time
  - Max cap is now 15
  - Also expires based on green collection count

Spawn utility:
- `spawnItem` in `src/features/game/engine/spawn.ts` computes available cells excluding snake, existing items, and hard-mode structures.
- Supports override options for expiration metadata.

## Difficulty and Board Behavior

Configured in `constants.ts` and `initialState.ts`.

- Difficulty affects base move rate (`baseTicksPerMove`).
- Speed scaling is score-driven in `nextTicksPerMove`.
- Board is 20x20.
- Hard mode generates static obstacle structures (4-6, 3-7 cells each) at initialization.
- Structures are non-touching (one-cell buffer) and treated as hard collisions.

## Input and Controls

- Keyboard:
  - Arrows/WASD queue direction changes.
  - Spacebar behavior in `GameClient`:
    - idle -> start
    - running -> pause
    - paused -> resume
- Mobile:
  - Swipe gestures map to cardinal direction.
  - On-screen D-pad is available on small screens.

## Rendering and UI Composition

- `GameCanvas` performs immediate-mode drawing on every state change:
  - responsive width up to 440px
  - grid + snake + structures + item circles
- `GameHUD` surfaces score, best, computed speed, and phase.
- Overlays:
  - `GameStartOverlay` during idle state
  - `GameOverModal` during gameover, with share actions and copy text

## Persistence and Hydration

- High score is persisted to `localStorage` via `usePersistHighScore`.
- To avoid hydration mismatch:
  - initial render starts with `highScore: 0`
  - actual score is hydrated in a client `useEffect` (`hydrate-high-score` action).

## Determinism and RNG

- RNG is seed-driven LCG (`src/features/game/lib/random.ts`).
- Engine updates use and carry `rngSeed` through state.
- This makes behavior reproducible if initial seed is controlled.

## File Map for Fast Ownership

- App entry:
  - `src/app/page.tsx`
  - `src/app/layout.tsx`
- Orchestration:
  - `src/features/game/components/GameClient.tsx`
- Engine:
  - `src/features/game/engine/types.ts`
  - `src/features/game/engine/constants.ts`
  - `src/features/game/engine/initialState.ts`
  - `src/features/game/engine/updateGame.ts`
  - `src/features/game/engine/spawn.ts`
  - `src/features/game/engine/collision.ts`
  - `src/features/game/engine/scoring.ts`
- Rendering/UI:
  - `src/features/game/components/GameCanvas.tsx`
  - `src/features/game/components/GameHUD.tsx`
  - `src/features/game/components/GameControls.tsx`
  - `src/features/game/components/GameStartOverlay.tsx`
  - `src/features/game/components/GameOverModal.tsx`
  - `src/features/game/components/GameTouchControls.tsx`
- Input hooks:
  - `src/features/game/hooks/useGameLoop.ts`
  - `src/features/game/hooks/useKeyboardInput.ts`
  - `src/features/game/hooks/useSwipeInput.ts`
  - `src/features/game/hooks/usePersistentSettings.ts`

## Known Operational Notes

- Local lint command execution in this environment has intermittently hung/aborted despite file-level diagnostics remaining clean.
- Next.js build may warn about multiple lockfiles and inferred root. This does not currently block successful build output.

## Recommended Next Engineering Steps

1. Add unit tests for `tickGame` spawn/expiry/collision transitions.
2. Add explicit balancing constants for per-item max counts and spawn cadence in `constants.ts`.
3. Introduce a debug panel for live tick/item counts to tune game feel without code edits.
4. Add telemetry hooks for session length, score distribution, and item interaction rates.

