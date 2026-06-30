import type { LeaderboardTimeframe } from "../domain/constants";

interface TimeframeBounds {
  start: Date;
  end: Date;
}

function startOfDayUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function getTimeframeBounds(
  timeframe: LeaderboardTimeframe,
  now: Date = new Date(),
): TimeframeBounds | null {
  if (timeframe === "all") {
    return null;
  }

  if (timeframe === "daily") {
    const start = startOfDayUtc(now);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
  }

  if (timeframe === "weekly") {
    const start = startOfDayUtc(now);
    const day = start.getUTCDay();
    start.setUTCDate(start.getUTCDate() - day);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { start, end };
  }

  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
  return { start, end };
}
