import { notFound, redirect } from "next/navigation";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";
import { LeaderboardTimeframeNav } from "@/features/leaderboard/components/LeaderboardTimeframeNav";
import {
  LEADERBOARD_DIFFICULTIES,
  LEADERBOARD_TOP_PAGE_LIMIT,
} from "@/features/leaderboard/domain/constants";
import {
  isLegacyDifficultyKey,
  normalizeDifficultyKey,
} from "@/features/leaderboard/domain/difficultyCompat";
import { getLeaderboard } from "@/features/leaderboard/server/service";
import { parseDifficultyLeaderboardTimeframe } from "@/features/leaderboard/server/timeframeParse";
import { difficultyLabels } from "@/features/game/engine/types";
import { getDifficultyLabels } from "../page";
import { GameHeader } from "@/features/game/components/GameHeader";
import {
  InvertLink,
  PrimaryInvertLink,
  PrimaryLink,
} from "@/features/ui/components/Link";

interface DifficultyLeaderboardPageProps {
  params: Promise<{ difficulty: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DifficultyLeaderboardPage({
  params,
  searchParams,
}: DifficultyLeaderboardPageProps) {
  const resolvedParams = await params;
  if (isLegacyDifficultyKey(resolvedParams.difficulty)) {
    redirect("/leaderboard/diabolical");
  }

  const difficulty = normalizeDifficultyKey(resolvedParams.difficulty);
  if (!difficulty) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const timeframe = parseDifficultyLeaderboardTimeframe(resolvedSearchParams);
  const entries = await getLeaderboard({
    difficulty,
    timeframe,
    limit: LEADERBOARD_TOP_PAGE_LIMIT,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--text)]">
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
        <header className="space-y-2">
          <GameHeader byLine="Leaderboard" />
          <h3>
            Top 100 Scores - <code>{difficultyLabels[difficulty]}</code> mode
          </h3>
        </header>
        <div className="flex justify-between">
          <LeaderboardTimeframeNav
            basePath={`/leaderboard/${difficulty}`}
            activeTimeframe={timeframe}
            options={["all", "daily", "weekly"]}
          />
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Browse by difficulty</h2>
            <div className="flex flex-wrap gap-2">
              <InvertLink href="/leaderboard" className="px-3 py-1.5 text-sm">
                All
              </InvertLink>
              {LEADERBOARD_DIFFICULTIES.map((difficultyKey) => {
                return difficultyKey === difficulty ? (
                  <PrimaryLink
                    key={difficultyKey}
                    href={`/leaderboard/${difficultyKey}`}
                    className="px-3 py-1.5 text-sm font-medium"
                  >
                    {getDifficultyLabels(difficultyKey)}
                  </PrimaryLink>
                ) : (
                  <InvertLink
                    key={difficultyKey}
                    href={`/leaderboard/${difficultyKey}`}
                    className="px-3 py-1.5 text-sm"
                  >
                    {getDifficultyLabels(difficultyKey)}
                  </InvertLink>
                );
              })}
            </div>
          </section>
        </div>

        <LeaderboardTable entries={entries} currentDifficulty={difficulty} />
        <InvertLink href="/leaderboard" className="w-fit px-3 py-1.5 text-sm">
          Back to all difficulties
        </InvertLink>
      </main>
    </div>
  );
}
