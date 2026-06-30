import type { LeaderboardDifficulty } from "./constants";
import type {
  LeaderboardQueryInput,
  SubmitLeaderboardEntryInput,
} from "./schema";

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  difficulty: LeaderboardDifficulty;
  createdAt: Date;
}

export interface LeaderboardErrorResponse {
  error: string;
  details?: unknown;
}

export interface SubmitLeaderboardEntrySuccessResponse {
  entry: LeaderboardEntry;
  rank: number;
  leaderboardPath: string;
}

export interface LeaderboardListResponse {
  entries: LeaderboardEntry[];
  query: Pick<LeaderboardQueryInput, "difficulty" | "limit" | "timeframe">;
}

export type SubmitLeaderboardRequest = SubmitLeaderboardEntryInput;
