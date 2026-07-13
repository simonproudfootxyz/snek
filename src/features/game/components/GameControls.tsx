import type { GamePhase } from "../engine/types";
import Button, {
  InvertButton,
  PrimaryButton,
  PrimaryInvertButton,
} from "@/features/ui/components/Button";

interface GameControlsProps {
  phase: GamePhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export function GameControls({
  phase,
  onStart,
  onPause,
  onResume,
  onRestart,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      {phase === "idle" && (
        <PrimaryButton type="button" onClick={onStart} className="px-4 py-2 text-sm">
          Start
        </PrimaryButton>
      )}
      {phase === "running" && (
        <Button type="button" onClick={onPause} className="px-4 py-2 text-sm">
          Pause
        </Button>
      )}
      {phase === "paused" && (
        <PrimaryInvertButton
          type="button"
          onClick={onResume}
          className="px-4 py-2 text-sm"
        >
          Resume
        </PrimaryInvertButton>
      )}
      <InvertButton type="button" onClick={onRestart} className="px-4 py-2 text-sm">
        Restart
      </InvertButton>
    </div>
  );
}
