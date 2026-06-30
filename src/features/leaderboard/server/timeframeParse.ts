import { z } from "zod";
import type { LeaderboardTimeframe } from "../domain/constants";

const allPageTimeframeSchema = z
  .enum(["all", "daily", "weekly", "monthly"])
  .default("all");
const difficultyPageTimeframeSchema = z
  .enum(["all", "daily", "weekly"])
  .default("all");

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(searchParams: SearchParams, key: string): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseAllLeaderboardTimeframe(
  searchParams: SearchParams,
): LeaderboardTimeframe {
  const result = allPageTimeframeSchema.safeParse(
    readParam(searchParams, "timeframe"),
  );
  return result.success ? result.data : "all";
}

export function parseDifficultyLeaderboardTimeframe(
  searchParams: SearchParams,
): LeaderboardTimeframe {
  const result = difficultyPageTimeframeSchema.safeParse(
    readParam(searchParams, "timeframe"),
  );
  return result.success ? result.data : "all";
}
