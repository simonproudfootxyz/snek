import { LEADERBOARD_MIN_SCORE } from "../domain/constants";
import type {
  LeaderboardQueryInput,
  SubmitLeaderboardEntryInput,
} from "../domain/schema";
import { getEntryRank, listTopEntries, insertEntry } from "./repository";
import { getTimeframeBounds } from "./timeframe";

export class LeaderboardValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeaderboardValidationError";
  }
}

export async function submitEntry(input: SubmitLeaderboardEntryInput) {
  if (input.score < LEADERBOARD_MIN_SCORE) {
    throw new LeaderboardValidationError(
      `Score must be at least ${LEADERBOARD_MIN_SCORE}`,
    );
  }

  const entry = await insertEntry(input);
  const rank = await getEntryRank(entry);

  return {
    entry,
    rank,
    leaderboardPath: `/leaderboard/${entry.difficulty}`,
  };
}

export async function getLeaderboard(params: LeaderboardQueryInput) {
  const bounds = getTimeframeBounds(params.timeframe);
  return listTopEntries({
    difficulty: params.difficulty,
    limit: params.limit,
    start: bounds?.start,
    end: bounds?.end,
  });
}
