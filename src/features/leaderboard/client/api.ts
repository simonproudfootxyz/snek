import type {
  LeaderboardErrorResponse,
  SubmitLeaderboardEntrySuccessResponse,
  SubmitLeaderboardRequest,
} from "../domain/types";

export async function postLeaderboardEntry(payload: SubmitLeaderboardRequest) {
  const response = await fetch("/api/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorResponse = (await response.json()) as LeaderboardErrorResponse;
    throw new Error(errorResponse.error ?? "Failed to submit leaderboard entry");
  }

  return (await response.json()) as SubmitLeaderboardEntrySuccessResponse;
}
