"use client";
import "./GameClient.css";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { createInitialState } from "../engine/initialState";
import { queueDirection, tickGame } from "../engine/updateGame";
import type { Difficulty, Direction, GameState } from "../engine/types";
import { GameCanvas } from "./GameCanvas";
import { GameHUD } from "./GameHUD";
import { GameOverModal } from "./GameOverModal";
import { GameStartOverlay } from "./GameStartOverlay";
import { GameTouchControls } from "./GameTouchControls";
import { useGameLoop } from "../hooks/useGameLoop";
import {
  readHighScore,
  usePersistHighScore,
} from "../hooks/usePersistentSettings";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useSwipeInput } from "../hooks/useSwipeInput";

type Action =
  | { type: "tick" }
  | { type: "queue-direction"; direction: Direction }
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "restart" }
  | { type: "hydrate-high-score"; highScore: number }
  | { type: "set-difficulty"; difficulty: Difficulty };

function reducer(state: GameState, action: Action): GameState {
  if (action.type === "tick") {
    const nextState = tickGame(state);
    if (state.phase === "running" && nextState.phase === "gameover") {
      return {
        ...nextState,
        lastScore: nextState.score,
      };
    }
    return nextState;
  }

  if (action.type === "queue-direction") {
    return queueDirection(state, action.direction);
  }

  if (action.type === "start") {
    if (state.phase !== "idle") {
      return state;
    }
    return { ...state, phase: "running" };
  }

  if (action.type === "pause") {
    if (state.phase !== "running") {
      return state;
    }
    return { ...state, phase: "paused" };
  }

  if (action.type === "resume") {
    if (state.phase !== "paused") {
      return state;
    }
    return { ...state, phase: "running" };
  }

  if (action.type === "restart") {
    return createInitialState({
      difficulty: state.difficulty,
      highScore: state.highScore,
      lastScore: state.phase === "gameover" ? state.score : state.lastScore,
    });
  }

  if (action.type === "hydrate-high-score") {
    if (action.highScore <= state.highScore) {
      return state;
    }

    return {
      ...state,
      highScore: action.highScore,
    };
  }

  if (state.phase === "running") {
    return state;
  }

  return createInitialState({
    difficulty: action.difficulty,
    highScore: state.highScore,
    lastScore: state.lastScore,
  });
}

function createStateFromStorage(): GameState {
  return createInitialState({
    difficulty: "normal",
    highScore: 0,
    lastScore: 0,
  });
}

export function GameClient() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    createStateFromStorage,
  );

  useEffect(() => {
    dispatch({ type: "hydrate-high-score", highScore: readHighScore() });
  }, []);

  const msPerTick = useMemo(
    () => state.ticksPerMove * 40,
    [state.ticksPerMove],
  );
  useGameLoop({
    isRunning: state.phase === "running",
    msPerTick,
    onTick: () => dispatch({ type: "tick" }),
  });

  const queue = useCallback(
    (direction: Direction) => dispatch({ type: "queue-direction", direction }),
    [],
  );
  const startGame = useCallback(() => dispatch({ type: "start" }), []);
  const handleSpace = useCallback(() => {
    if (state.phase === "idle") {
      dispatch({ type: "start" });
      return;
    }

    if (state.phase === "running") {
      dispatch({ type: "pause" });
      return;
    }

    if (state.phase === "paused") {
      dispatch({ type: "resume" });
    }
  }, [state.phase]);
  useKeyboardInput({ onDirection: queue, onSpace: handleSpace });
  const touchHandlers = useSwipeInput(queue);
  usePersistHighScore(state.highScore);

  return (
    <section
      className="game-client-container mx-auto flex w-full max-w-[980px] flex-col gap-6"
      {...touchHandlers}
      role="application"
      aria-label="Snek game area"
    >
      <GameHUD state={state} />
      <div
        className={`relative w-full max-w-[440px] game-canvas-container ${state.phase === "running" && "game-canvas-container--active"}`}
      >
        <GameCanvas state={state} className="game-play-area" />
        {state.phase === "idle" && (
          <GameStartOverlay
            onStart={startGame}
            difficulty={state.difficulty}
            onDifficultyChange={(difficulty) =>
              dispatch({ type: "set-difficulty", difficulty })
            }
          />
        )}
        {state.phase === "gameover" && (
          <GameOverModal
            difficulty={state.difficulty}
            score={state.score}
            onRestart={() => dispatch({ type: "restart" })}
          />
        )}
      </div>
      <div className="game-controls-container">
        <GameTouchControls onDirection={queue} />
      </div>
    </section>
  );
}
