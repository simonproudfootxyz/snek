import type { GameState } from "../engine/types";

interface GameHUDProps {
  state: GameState;
}

export function GameHUD({ state }: GameHUDProps) {
  const speed = Math.round((1000 / state.ticksPerMove) * 10) / 10;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-wide text-white/55">Score</p>
        <p className="text-xl font-semibold text-white">{state.score}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-wide text-white/55">
          Best Score
        </p>
        <p className="text-xl font-semibold text-white">{state.highScore}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-wide text-white/55">
          Last Score
        </p>
        <p className="text-xl font-semibold text-white">{state.lastScore}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-wide text-white/55">Speed</p>
        <p className="text-xl font-semibold text-white">{speed}</p>
      </div>
    </div>
  );
}
