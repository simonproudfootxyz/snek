import { difficultyLabels, type Difficulty } from "../engine/types";
import Button, {
  InvertButton,
  PrimaryButton,
  PrimaryInvertButton,
} from "@/features/ui/components/Button";
import Modal from "@/features/ui/components/Modal/Modal";

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
  const isHardLikeMode = difficulty === "hard" || difficulty === "diabolical";
  const hasStructures = difficulty === "puzzle" || difficulty === "diabolical";
  return (
    <Modal size="sm" closeOnBackdrop={false} contained>
      <div className="text-center">
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
        <ul className="mt-4 space-y-1 text-sm text-white/75">
          <li>
            Use your arrow keys (<code>↑,↓,←,→</code>) or <code>WASD</code> keys
            to steer.
          </li>
          <li>On mobile, use the arrow buttons to navigate.</li>
        </ul>
        <fieldset className="mt-2">
          <legend className="mb-2 text-sm text-white/75">Difficulty</legend>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(difficultyLabels).map(([difficultyKey, label]) => {
              const value = difficultyKey as Difficulty;
              const isSelected = difficulty === value;
              const id = `difficulty-${value}`;

              if (isSelected) {
                return (
                  <Button
                    key={id}
                    type="button"
                    onClick={() => onDifficultyChange(value)}
                    className="w-full"
                  >
                    {label}
                  </Button>
                );
              }

              return (
                <InvertButton
                  key={id}
                  type="button"
                  onClick={() => onDifficultyChange(value)}
                  className="w-full"
                  id={id}
                >
                  {label}
                </InvertButton>
              );
            })}
          </div>
        </fieldset>
        <div>
          <PrimaryButton
            type="button"
            onClick={onStart}
            className="mt-2 px-4 py-2 text-sm"
          >
            Start game
          </PrimaryButton>
          <p className="mt-2 text-sm text-white/75">
            Press <code>Spacebar</code> to start, pause, or resume instantly.
          </p>
        </div>
      </div>
    </Modal>
  );
}
