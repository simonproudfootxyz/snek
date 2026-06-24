import type { Difficulty } from "../engine/types";

interface GameStartOverlayProps {
  onStart: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function GameStartOverlay({
  onStart,
  difficulty,
  onDifficultyChange,
}: GameStartOverlayProps) {
  const isHardMode = difficulty === "hard";

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-[2px]">
      <div className=".modal-body w-[320px] rounded-xl border border-white/15 bg-[#161a24] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">
          Welcome to Snek, The Game
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          Collect green, blue, and yellow items. Avoid red items and walls.
        </p>
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-left">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Square legend
          </p>
          <ul className="mt-2 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#8ae35f]" aria-hidden />
              Green = +10 points
              {isHardMode ? " and +1 length" : ""}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#56b3ff]" aria-hidden />
              Blue = +20 points
              {isHardMode ? " and +3 length" : ""}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#ffd95b]" aria-hidden />
              Yellow = -5 points and -1 length
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#ff6a88]" aria-hidden />
              Red = game over
            </li>
          </ul>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-white/75">
          <li>Use arrows or WASD to steer.</li>
          <li>
            Press <code>Spacebar</code> to start, pause, or resume instantly.
          </li>
          <li>On mobile, use the arrow buttons below.</li>
        </ul>
        <label className="mt-4 flex items-center justify-center gap-2 text-sm text-white/75">
          Difficulty
          <select
            className="rounded-md border border-white/20 bg-[#1b1f2a] px-2 py-1 text-white"
            value={difficulty}
            onChange={(event) =>
              onDifficultyChange(event.target.value as Difficulty)
            }
          >
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="puzzle">Puzzle</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onStart}
          className="mt-5 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-emerald-300"
        >
          Start game
        </button>
      </div>
    </div>
  );
}
