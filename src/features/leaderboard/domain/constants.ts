export const LEADERBOARD_MIN_SCORE = 300;

export const LEADERBOARD_PLAYER_NAME_MIN_LENGTH = 3;
export const LEADERBOARD_PLAYER_NAME_MAX_LENGTH = 20;
export const LEADERBOARD_DEFAULT_LIMIT = 20;
export const LEADERBOARD_MAX_LIMIT = 100;
export const LEADERBOARD_TOP_PAGE_LIMIT = 100;

export const LEADERBOARD_DIFFICULTIES = [
  "normal",
  "hard",
  "puzzle",
  "very-hard",
] as const;

export const LEADERBOARD_TIMEFRAMES = [
  "all",
  "daily",
  "weekly",
  "monthly",
] as const;

export type LeaderboardDifficulty = (typeof LEADERBOARD_DIFFICULTIES)[number];
export type LeaderboardTimeframe = (typeof LEADERBOARD_TIMEFRAMES)[number];
