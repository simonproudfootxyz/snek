import { z } from "zod";
import {
  LEADERBOARD_DEFAULT_LIMIT,
  LEADERBOARD_DIFFICULTIES,
  LEADERBOARD_MAX_LIMIT,
  LEADERBOARD_MIN_SCORE,
  LEADERBOARD_PLAYER_NAME_MAX_LENGTH,
  LEADERBOARD_PLAYER_NAME_MIN_LENGTH,
  LEADERBOARD_TIMEFRAMES,
} from "./constants";

const playerNameSchema = z
  .string()
  .trim()
  .min(
    LEADERBOARD_PLAYER_NAME_MIN_LENGTH,
    `Name must be at least ${LEADERBOARD_PLAYER_NAME_MIN_LENGTH} characters`,
  )
  .max(
    LEADERBOARD_PLAYER_NAME_MAX_LENGTH,
    `Name must be at most ${LEADERBOARD_PLAYER_NAME_MAX_LENGTH} characters`,
  )
  .regex(/^[a-zA-Z0-9 _-]+$/, "Name contains unsupported characters");

export const submitLeaderboardEntrySchema = z.object({
  playerName: playerNameSchema,
  score: z
    .number()
    .int("Score must be an integer")
    .gte(LEADERBOARD_MIN_SCORE, `Score must be at least ${LEADERBOARD_MIN_SCORE}`),
  difficulty: z.enum(LEADERBOARD_DIFFICULTIES),
});

export const leaderboardQuerySchema = z.object({
  difficulty: z.enum(LEADERBOARD_DIFFICULTIES).optional(),
  timeframe: z.enum(LEADERBOARD_TIMEFRAMES).default("all"),
  limit: z.coerce.number().int().min(1).max(LEADERBOARD_MAX_LIMIT).default(
    LEADERBOARD_DEFAULT_LIMIT,
  ),
});

export type SubmitLeaderboardEntryInput = z.infer<
  typeof submitLeaderboardEntrySchema
>;
export type LeaderboardQueryInput = z.infer<typeof leaderboardQuerySchema>;
