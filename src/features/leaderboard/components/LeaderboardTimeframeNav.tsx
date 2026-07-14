import type { LeaderboardTimeframe } from "../domain/constants";
import {
  InvertLink,
  PrimaryInvertLink,
  PrimaryLink,
} from "@/features/ui/components/Link";

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
          if (isActive) {
            return (
              <PrimaryLink
                key={timeframe}
                href={href}
                className="px-3 py-1.5 text-sm font-medium"
              >
                {labelForTimeframe(timeframe)}
              </PrimaryLink>
            );
          }
          return (
            <InvertLink
              key={timeframe}
              href={href}
              className="px-3 py-1.5 text-sm"
            >
              {labelForTimeframe(timeframe)}
            </InvertLink>
          );
        })}
      </nav>
    </div>
  );
}
