import Link from "next/link";
import type { LeaderboardTimeframe } from "../domain/constants";

interface LeaderboardTimeframeNavProps {
  basePath: string;
  activeTimeframe: LeaderboardTimeframe;
  options: readonly LeaderboardTimeframe[];
}

function labelForTimeframe(timeframe: LeaderboardTimeframe): string {
  if (timeframe === "all") return "All time";
  if (timeframe === "daily") return "Daily";
  if (timeframe === "weekly") return "Weekly";
  return "Monthly";
}

export function LeaderboardTimeframeNav({
  basePath,
  activeTimeframe,
  options,
}: LeaderboardTimeframeNavProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Filter by timeframe</h2>
      <nav
        className="flex flex-wrap gap-2"
        aria-label="Leaderboard timeframe filter"
      >
        {options.map((timeframe) => {
          const isActive = timeframe === activeTimeframe;
          const href =
            timeframe === "all"
              ? basePath
              : `${basePath}?timeframe=${timeframe}`;
          return (
            <Link
              key={timeframe}
              href={href}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-300 bg-emerald-300/20 text-emerald-200"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {labelForTimeframe(timeframe)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
