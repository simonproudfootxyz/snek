import { GameClient } from "@/features/game/components/GameClient";
import { GameHeader } from "@/features/game/components/GameHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--text)]">
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        <GameHeader />
        <GameClient />
      </main>
    </div>
  );
}
