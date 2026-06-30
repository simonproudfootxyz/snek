import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  LEADERBOARD_DIFFICULTIES,
  LEADERBOARD_MIN_SCORE,
} from "@/features/leaderboard/domain/constants";

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playerName: text("player_name").notNull(),
    score: integer("score").notNull(),
    difficulty: text("difficulty", {
      enum: [...LEADERBOARD_DIFFICULTIES],
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Use a SQL literal so generated migrations contain static DDL.
    check(
      "leaderboard_entries_score_min_check",
      sql`${table.score} >= ${sql.raw(String(LEADERBOARD_MIN_SCORE))}`,
    ),
    index("leaderboard_entries_score_idx").on(table.score),
    index("leaderboard_entries_difficulty_idx").on(table.difficulty),
    index("leaderboard_entries_created_at_idx").on(table.createdAt),
  ],
);

export type LeaderboardEntryRow = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntryRow = typeof leaderboardEntries.$inferInsert;
