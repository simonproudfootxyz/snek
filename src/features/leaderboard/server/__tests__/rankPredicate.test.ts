import { describe, expect, it } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { buildRowsAheadOfEntryPredicate } from "../repository";

describe("buildRowsAheadOfEntryPredicate", () => {
  it("excludes the submitted row from ahead-of count", () => {
    const predicate = buildRowsAheadOfEntryPredicate({
      id: "entry-self",
      playerName: "Simon",
      score: 475,
      difficulty: "normal",
      createdAt: new Date("2026-06-30T14:00:00.000Z"),
    });

    const dialect = new PgDialect();
    const compiled = dialect.sqlToQuery(sql`select count(*) from "leaderboard_entries" where ${predicate}`);

    expect(compiled.sql).toContain('not "leaderboard_entries"."id" = ');
  });

  it("uses deterministic tie-breaking for same score and timestamp", () => {
    const predicate = buildRowsAheadOfEntryPredicate({
      id: "entry-self",
      playerName: "Simon",
      score: 475,
      difficulty: "normal",
      createdAt: new Date("2026-06-30T14:00:00.000Z"),
    });

    const dialect = new PgDialect();
    const compiled = dialect.sqlToQuery(sql`select count(*) from "leaderboard_entries" where ${predicate}`);

    expect(compiled.sql).toContain('"leaderboard_entries"."score" > ');
    expect(compiled.sql).toContain('"leaderboard_entries"."created_at" > ');
    expect(compiled.sql).toContain('"leaderboard_entries"."id" > ');
  });
});
