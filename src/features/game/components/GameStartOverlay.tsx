interface GameStartOverlayProps {
  onStart: () => void;
}

export function GameStartOverlay({ onStart }: GameStartOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-[2px]">
      <div className="w-[320px] rounded-xl border border-white/15 bg-[#161a24] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">
          Welcome to Snek, The Game
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          Collect green, avoid red and walls.
        </p>
        <ul className="mt-4 space-y-1 text-sm text-white/75">
          <li>Use arrows or WASD to steer.</li>
          <li>Press Space to start instantly.</li>
          <li>On mobile, use the arrow buttons below.</li>
        </ul>
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
