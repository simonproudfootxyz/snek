import { Difficulty, difficultyLabels } from "@/features/game/engine/types";
import type { LeaderboardEntry } from "../domain/types";
import { getDifficultyLabels } from "@/app/leaderboard/page";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  allDifficulties?: boolean;
  currentDifficulty?: Difficulty;
}

export function LeaderboardTable({
  entries,
  allDifficulties,
  currentDifficulty,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-white/70">
        No leaderboard entries found for{" "}
        {allDifficulties
          ? "all difficulties"
          : `${getDifficultyLabels(currentDifficulty as Difficulty)} mode`}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/15 bg-black/20">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-white/15 text-white/65">
          <tr>
            <th className="px-3 py-2 font-semibold">Rank</th>
            <th className="px-3 py-2 font-semibold">Player</th>
            <th className="px-3 py-2 font-semibold">Score</th>
            {allDifficulties && (
              <th className="px-3 py-2 font-semibold">Difficulty</th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const difficultyLabel =
              difficultyLabels[entry.difficulty as Difficulty];
            return (
              <tr
                key={entry.id}
                className="border-b border-white/10 last:border-b-0"
              >
                <td className="px-3 py-2 text-white/80">#{index + 1}</td>
                <td className="px-3 py-2 text-white">{entry.playerName}</td>
                <td className="px-3 py-2 font-semibold text-emerald-300">
                  {entry.score}
                </td>
                {allDifficulties && (
                  <td className="px-3 py-2 text-white/80">{difficultyLabel}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
