CREATE TABLE "leaderboard_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_name" text NOT NULL,
	"score" integer NOT NULL,
	"difficulty" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_entries_score_min_check" CHECK ("leaderboard_entries"."score" >= 300)
);
--> statement-breakpoint
CREATE INDEX "leaderboard_entries_score_idx" ON "leaderboard_entries" USING btree ("score");--> statement-breakpoint
CREATE INDEX "leaderboard_entries_difficulty_idx" ON "leaderboard_entries" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "leaderboard_entries_created_at_idx" ON "leaderboard_entries" USING btree ("created_at");