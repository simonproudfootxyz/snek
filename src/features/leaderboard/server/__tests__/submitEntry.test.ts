import { beforeEach, describe, expect, it, vi } from "vitest";
import { LEADERBOARD_MIN_SCORE } from "../../domain/constants";
import { LeaderboardValidationError, submitEntry } from "../service";
import { getEntryRank, insertEntry } from "../repository";

vi.mock("../repository", () => ({
  insertEntry: vi.fn(),
  getEntryRank: vi.fn(),
  listTopEntries: vi.fn(),
}));

describe("submitEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects scores below leaderboard minimum", async () => {
    await expect(
      submitEntry({
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE - 1,
        difficulty: "normal",
      }),
    ).rejects.toBeInstanceOf(LeaderboardValidationError);

    expect(insertEntry).not.toHaveBeenCalled();
  });

  it("accepts a score at the leaderboard minimum", async () => {
    vi.mocked(insertEntry).mockResolvedValue({
      id: "entry-1",
      playerName: "Simon",
      score: LEADERBOARD_MIN_SCORE,
      difficulty: "normal",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    vi.mocked(getEntryRank).mockResolvedValue(42);

    const result = await submitEntry({
      playerName: "Simon",
      score: LEADERBOARD_MIN_SCORE,
      difficulty: "normal",
    });

    expect(result.entry.score).toBe(LEADERBOARD_MIN_SCORE);
    expect(result.rank).toBe(42);
    expect(result.leaderboardPath).toBe("/leaderboard/normal");
    expect(insertEntry).toHaveBeenCalledOnce();
    expect(getEntryRank).toHaveBeenCalledOnce();
  });
});
