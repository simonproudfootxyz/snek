import { and, desc, eq, gt, gte, lt, not, sql, or } from "drizzle-orm";
import type { LeaderboardDifficulty } from "../domain/constants";
import type { LeaderboardEntry } from "../domain/types";
import type { SubmitLeaderboardEntryInput } from "../domain/schema";
import { getDb } from "@/lib/db/client";
import { leaderboardEntries } from "@/lib/db/schema";

interface ListTopEntriesParams {
  difficulty?: LeaderboardDifficulty;
  limit: number;
  start?: Date;
  end?: Date;
}

export function buildRowsAheadOfEntryPredicate(entry: LeaderboardEntry) {
  return and(
    not(eq(leaderboardEntries.id, entry.id)),
    eq(leaderboardEntries.difficulty, entry.difficulty),
    or(
      gt(leaderboardEntries.score, entry.score),
      and(
        eq(leaderboardEntries.score, entry.score),
        or(
          gt(leaderboardEntries.createdAt, entry.createdAt),
          and(
            eq(leaderboardEntries.createdAt, entry.createdAt),
            gt(leaderboardEntries.id, entry.id),
          ),
        ),
      ),
    ),
  );
}

function mapRowToEntry(row: typeof leaderboardEntries.$inferSelect): LeaderboardEntry {
  return {
    id: row.id,
    playerName: row.playerName,
    score: row.score,
    difficulty: row.difficulty as LeaderboardDifficulty,
    createdAt: row.createdAt,
  };
}

export async function insertEntry(input: SubmitLeaderboardEntryInput) {
  const db = getDb();
  const [row] = await db
    .insert(leaderboardEntries)
    .values({
      playerName: input.playerName.trim(),
      score: input.score,
      difficulty: input.difficulty,
    })
    .returning();

  return mapRowToEntry(row);
}

export async function listTopEntries(params: ListTopEntriesParams) {
  const db = getDb();
  const predicates = [];
  if (params.difficulty) {
    predicates.push(eq(leaderboardEntries.difficulty, params.difficulty));
  }
  if (params.start) {
    predicates.push(gte(leaderboardEntries.createdAt, params.start));
  }
  if (params.end) {
    predicates.push(lt(leaderboardEntries.createdAt, params.end));
  }

  const rows = await db.query.leaderboardEntries.findMany({
    where: predicates.length > 0 ? and(...predicates) : undefined,
    orderBy: [
      desc(leaderboardEntries.score),
      desc(leaderboardEntries.createdAt),
      desc(leaderboardEntries.id),
    ],
    limit: params.limit,
  });

  return rows.map(mapRowToEntry);
}

export async function getEntryRank(entry: LeaderboardEntry): Promise<number> {
  const db = getDb();
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(leaderboardEntries)
    .where(buildRowsAheadOfEntryPredicate(entry));

  return Number(result.count) + 1;
}
