import { describe, expect, it, vi } from "vitest";
import DifficultyLeaderboardPage from "../page";

const redirectMock = vi.fn((target: string) => {
  throw new Error(`REDIRECT:${target}`);
});

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirect: (target: string) => redirectMock(target),
}));

vi.mock("@/features/leaderboard/server/service", () => ({
  getLeaderboard: vi.fn(async () => []),
}));

describe("Difficulty leaderboard page", () => {
  it("redirects legacy very-hard difficulty to diabolical route", async () => {
    await expect(
      DifficultyLeaderboardPage({
        params: Promise.resolve({ difficulty: "very-hard" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("REDIRECT:/leaderboard/diabolical");

    expect(redirectMock).toHaveBeenCalledWith("/leaderboard/diabolical");
  });
});
