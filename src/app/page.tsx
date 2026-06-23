import { GameClient } from "@/features/game/components/GameClient";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--text)]">
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Good old fashioned arcade fun
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Snek Chase
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)] sm:text-base">
            Collect green and blue items for points, avoid pink hazards, and
            survive as the game speeds up.
          </p>
        </header>
        <GameClient />
      </main>
    </div>
  );
}
