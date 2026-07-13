import type { Direction } from "../engine/types";
import { InvertButton } from "@/features/ui/components/Button";

interface GameTouchControlsProps {
  onDirection: (direction: Direction) => void;
}

function ArrowButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <InvertButton
      type="button"
      onClick={onClick}
      className="h-12 w-12 text-xl font-semibold"
      aria-label={label}
    >
      {label}
    </InvertButton>
  );
}

export function GameTouchControls({ onDirection }: GameTouchControlsProps) {
  return (
    <div className="grid w-fit gap-2 game-touch-controls">
      <div />
      <ArrowButton label="↑" onClick={() => onDirection("up")} />
      <div />
      <ArrowButton label="←" onClick={() => onDirection("left")} />
      <ArrowButton label="↓" onClick={() => onDirection("down")} />
      <ArrowButton label="→" onClick={() => onDirection("right")} />
    </div>
  );
}
