import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { LEADERBOARD_MIN_SCORE } from "@/features/leaderboard/domain/constants";
import { submitEntry } from "@/features/leaderboard/server/service";
import { isAllowedToSubmitLeaderboard } from "@/features/leaderboard/server/rateLimit";
import { POST } from "../route";

vi.mock("@/features/leaderboard/server/service", () => ({
  submitEntry: vi.fn(),
  getLeaderboard: vi.fn(),
  LeaderboardValidationError: class LeaderboardValidationError extends Error {},
}));

vi.mock("@/features/leaderboard/server/rateLimit", () => ({
  isAllowedToSubmitLeaderboard: vi.fn(),
}));

describe("POST /api/leaderboard", () => {
  it("rejects scores below leaderboard minimum with 400", async () => {
    vi.mocked(isAllowedToSubmitLeaderboard).mockReturnValue(true);
    const request = new NextRequest("http://localhost:3000/api/leaderboard", {
      method: "POST",
      body: JSON.stringify({
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE - 1,
        difficulty: "normal",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("Invalid leaderboard submission");
    expect(submitEntry).not.toHaveBeenCalled();
  });

  it("accepts a score at leaderboard minimum with 201", async () => {
    vi.mocked(isAllowedToSubmitLeaderboard).mockReturnValue(true);
    vi.mocked(submitEntry).mockResolvedValue({
      entry: {
        id: "entry-1",
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE,
        difficulty: "normal",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      rank: 1,
      leaderboardPath: "/leaderboard/normal",
    });

    const request = new NextRequest("http://localhost:3000/api/leaderboard", {
      method: "POST",
      body: JSON.stringify({
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE,
        difficulty: "normal",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const body = (await response.json()) as {
      entry: { score: number };
      rank: number;
      leaderboardPath: string;
    };

    expect(response.status).toBe(201);
    expect(body.entry.score).toBe(LEADERBOARD_MIN_SCORE);
    expect(body.rank).toBe(1);
    expect(body.leaderboardPath).toBe("/leaderboard/normal");
    expect(submitEntry).toHaveBeenCalledOnce();
  });

  it("accepts legacy very-hard and normalizes to diabolical", async () => {
    vi.mocked(isAllowedToSubmitLeaderboard).mockReturnValue(true);
    vi.mocked(submitEntry).mockResolvedValue({
      entry: {
        id: "entry-2",
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE,
        difficulty: "diabolical",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      rank: 4,
      leaderboardPath: "/leaderboard/diabolical",
    });

    const request = new NextRequest("http://localhost:3000/api/leaderboard", {
      method: "POST",
      body: JSON.stringify({
        playerName: "Simon",
        score: LEADERBOARD_MIN_SCORE,
        difficulty: "very-hard",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(submitEntry).toHaveBeenCalledWith(
      expect.objectContaining({ difficulty: "diabolical" }),
    );
  });
});
