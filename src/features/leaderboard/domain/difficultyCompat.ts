import {
  LEADERBOARD_DIFFICULTIES,
  type LeaderboardDifficulty,
} from "./constants";

export const LEGACY_LEADERBOARD_DIFFICULTY = "very-hard";

export function isLegacyDifficultyKey(value: string): boolean {
  return value === LEGACY_LEADERBOARD_DIFFICULTY;
}

export function normalizeDifficultyKey(
  value: string | null | undefined,
): LeaderboardDifficulty | undefined {
  if (!value) {
    return undefined;
  }

  if (isLegacyDifficultyKey(value)) {
    return "diabolical";
  }

  if (
    LEADERBOARD_DIFFICULTIES.includes(value as LeaderboardDifficulty)
  ) {
    return value as LeaderboardDifficulty;
  }

  return undefined;
}
