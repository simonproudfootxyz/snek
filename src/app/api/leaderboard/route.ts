import { NextRequest, NextResponse } from "next/server";
import {
  leaderboardQuerySchema,
  submitLeaderboardEntrySchema,
} from "@/features/leaderboard/domain/schema";
import {
  getLeaderboard,
  LeaderboardValidationError,
  submitEntry,
} from "@/features/leaderboard/server/service";
import { isAllowedToSubmitLeaderboard } from "@/features/leaderboard/server/rateLimit";
import { logger } from "@/lib/server/logger";

export async function GET(request: NextRequest) {
  const parseResult = leaderboardQuerySchema.safeParse({
    difficulty: request.nextUrl.searchParams.get("difficulty") ?? undefined,
    timeframe: request.nextUrl.searchParams.get("timeframe") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid leaderboard query",
        details: parseResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const entries = await getLeaderboard(parseResult.data);
    return NextResponse.json({
      entries,
      query: parseResult.data,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch leaderboard entries");
    return NextResponse.json(
      { error: "Failed to fetch leaderboard entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedToSubmitLeaderboard(request)) {
    return NextResponse.json(
      { error: "Too many leaderboard submissions. Try again soon." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parseResult = submitLeaderboardEntrySchema.safeParse(payload);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid leaderboard submission",
        details: parseResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const submission = await submitEntry(parseResult.data);
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof LeaderboardValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error({ error }, "Failed to submit leaderboard entry");
    return NextResponse.json(
      { error: "Failed to submit leaderboard entry" },
      { status: 500 },
    );
  }
}
