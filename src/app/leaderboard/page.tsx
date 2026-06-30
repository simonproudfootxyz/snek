import Link from "next/link";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";
import { LeaderboardTimeframeNav } from "@/features/leaderboard/components/LeaderboardTimeframeNav";
import {
  LEADERBOARD_DIFFICULTIES,
  LEADERBOARD_TOP_PAGE_LIMIT,
} from "@/features/leaderboard/domain/constants";
import { getLeaderboard } from "@/features/leaderboard/server/service";
import { parseAllLeaderboardTimeframe } from "@/features/leaderboard/server/timeframeParse";
import { Difficulty, difficultyLabels } from "@/features/game/engine/types";

interface LeaderboardPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const getDifficultyLabels = (difficulty: Difficulty) => {
  return difficultyLabels[difficulty];
};

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const timeframe = parseAllLeaderboardTimeframe(resolvedSearchParams);
  const entries = await getLeaderboard({
    timeframe,
    limit: LEADERBOARD_TOP_PAGE_LIMIT,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--text)]">
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Leaderboard
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Snek, The Game
          </h1>
          <h3>Top 100 Scores</h3>
        </header>
        <div className="flex justify-between">
          <LeaderboardTimeframeNav
            basePath="/leaderboard"
            activeTimeframe={timeframe}
            options={["all", "daily", "weekly", "monthly"]}
          />
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Browse by difficulty</h2>
            <div className="flex flex-wrap gap-2">
              {LEADERBOARD_DIFFICULTIES.map((difficulty) => (
                <Link
                  key={difficulty}
                  href={`/leaderboard/${difficulty}`}
                  className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10"
                >
                  {getDifficultyLabels(difficulty)}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <LeaderboardTable entries={entries} allDifficulties={true} />
      </main>
    </div>
  );
}
