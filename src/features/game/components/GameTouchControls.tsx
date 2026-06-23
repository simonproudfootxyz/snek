import type { Direction } from "../engine/types";

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
    <button
      type="button"
      onClick={onClick}
      className="h-12 w-12 rounded-lg border border-white/20 bg-white/10 text-xl font-semibold text-white active:bg-white/25"
      aria-label={label}
    >
      {label}
    </button>
  );
}

export function GameTouchControls({ onDirection }: GameTouchControlsProps) {
  return (
    <div className="grid w-fit grid-cols-3 gap-2 sm:hidden game-touch-controls">
      <div />
      <ArrowButton label="↑" onClick={() => onDirection("up")} />
      <div />
      <ArrowButton label="←" onClick={() => onDirection("left")} />
      <ArrowButton label="↓" onClick={() => onDirection("down")} />
      <ArrowButton label="→" onClick={() => onDirection("right")} />
    </div>
  );
}
