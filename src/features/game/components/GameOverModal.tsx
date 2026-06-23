interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

export function GameOverModal({ score, onRestart }: GameOverModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-[2px]">
      <div className="w-[300px] rounded-xl border border-white/15 bg-[#161a24] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">Run ended</p>
        <p className="mt-2 text-3xl font-semibold text-white">{score}</p>
        <p className="mt-1 text-sm text-white/70">Avoid bad items and walls to go longer.</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-5 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-emerald-300"
        >
          Play again
        </button>
      </div>
    </div>
  );
}
