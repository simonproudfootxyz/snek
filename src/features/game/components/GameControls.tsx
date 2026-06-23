import type { Difficulty, GamePhase } from "../engine/types";

interface GameControlsProps {
  phase: GamePhase;
  difficulty: Difficulty;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function GameControls({
  phase,
  difficulty,
  onStart,
  onPause,
  onResume,
  onRestart,
  onDifficultyChange,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {phase === "idle" && (
        <button
          type="button"
          onClick={onStart}
          className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-emerald-300"
        >
          Start
        </button>
      )}
      {phase === "running" && (
        <button
          type="button"
          onClick={onPause}
          className="rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-slate-200"
        >
          Pause
        </button>
      )}
      {phase === "paused" && (
        <button
          type="button"
          onClick={onResume}
          className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-sky-300"
        >
          Resume
        </button>
      )}
      <button
        type="button"
        onClick={onRestart}
        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        Restart
      </button>
      <label className="ml-auto flex items-center gap-2 text-sm text-white/75">
        Difficulty
        <select
          className="rounded-md border border-white/20 bg-[#1b1f2a] px-2 py-1 text-white"
          value={difficulty}
          onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </div>
  );
}
