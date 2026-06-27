import { difficultyLabels, type Difficulty } from "../engine/types";

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
  const isHardLikeMode = difficulty === "hard" || difficulty === "very-hard";
  const hasStructures = difficulty === "puzzle" || difficulty === "very-hard";
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-[2px]">
      <div className=".modal-body w-[320px] rounded-xl border border-white/15 bg-[#161a24] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">
          Welcome to Snek, The Game
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          Collect green, blue, and yellow items. Avoid red items
          {hasStructures ? ", structures, and walls." : " and walls."}
        </p>
        <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-left">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Square legend
          </p>
          <ul className="mt-2 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#8ae35f]" aria-hidden />
              Green = +10 points
              {isHardLikeMode ? " and +1 length" : ""}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#56b3ff]" aria-hidden />
              Blue = +20 points
              {isHardLikeMode ? " and +3 length (Hard)" : ""}
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
        <p className="mt-2">
          <small>
            Use your arrow keys, <code>WASD</code> keys, or touch the arrow
            buttons below to steer. Press <code>Spacebar</code> to start, pause,
            or resume instantly. On mobile, use the arrow buttons below.
          </small>
        </p>
        {/* <ul className="mt-4 space-y-1 text-sm text-white/75">
          <li>
            <small>
              Use your arrow keys, <code>WASD</code> keys, or touch the arrow
              buttons below to steer.
            </small>
          </li>
          <li>
            <small>
              Press <code>Spacebar</code> to start, pause, or resume instantly.
            </small>
          </li>
          <li>
            <small>On mobile, use the arrow buttons below.</small>
          </li>
        </ul> */}
        <fieldset className="mt-2">
          <legend className="mb-2 text-sm text-white/75">Difficulty</legend>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(difficultyLabels).map(([difficultyKey, label]) => {
              const value = difficultyKey as Difficulty;
              const isSelected = difficulty === value;
              const id = `difficulty-${value}`;

              return (
                <label
                  key={value}
                  htmlFor={id}
                  className={`cursor-pointer rounded-md border px-2 py-1 text-sm font-medium transition ${
                    isSelected
                      ? "border-emerald-300 bg-emerald-400/25 text-white"
                      : "border-white/20 bg-[#1b1f2a] text-white/80 hover:bg-[#252b3a]"
                  }`}
                >
                  <input
                    id={id}
                    type="radio"
                    name="difficulty"
                    value={value}
                    checked={isSelected}
                    onChange={() => onDifficultyChange(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={onStart}
          className="mt-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-emerald-300"
        >
          Start game
        </button>
      </div>
    </div>
  );
}
