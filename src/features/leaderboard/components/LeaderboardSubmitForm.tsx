"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Difficulty } from "@/features/game/engine/types";
import type { SubmitLeaderboardEntrySuccessResponse } from "../domain/types";
import { submitLeaderboardEntrySchema } from "../domain/schema";
import { useLeaderboardSubmit } from "../client/useLeaderboardSubmit";
import { getDifficultyLabels } from "@/app/leaderboard/page";
import Button, {
  PrimaryButton,
  PrimaryInvertButton,
} from "@/features/ui/components/Button";
import "./LeaderboardSubmitForm.css";

const leaderboardNameSchema = submitLeaderboardEntrySchema.pick({
  playerName: true,
});

type LeaderboardNameFormValues = z.infer<typeof leaderboardNameSchema>;

interface LeaderboardSubmitFormProps {
  score: number;
  difficulty: Difficulty;
  onSubmissionSuccess?: (
    submission: SubmitLeaderboardEntrySuccessResponse,
  ) => void;
}

export function LeaderboardSubmitForm({
  score,
  difficulty,
  onSubmissionSuccess,
}: LeaderboardSubmitFormProps) {
  const {
    isSubmitting,
    isSubmitted,
    submitError,
    submission,
    submitLeaderboardEntry,
  } = useLeaderboardSubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaderboardNameFormValues>({
    resolver: zodResolver(leaderboardNameSchema),
    defaultValues: {
      playerName: "",
    },
  });

  async function onSubmit(values: LeaderboardNameFormValues) {
    const result = await submitLeaderboardEntry({
      playerName: values.playerName,
      score,
      difficulty,
    });
    if (result) {
      onSubmissionSuccess?.(result);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-white/15 bg-black/20 p-3 text-left">
      <p className="text-xs uppercase tracking-[0.15em] text-white/60">
        Leaderboard Entry
      </p>
      {!isSubmitted && (
        <p className="mt-1 text-xs text-white/70">
          Enter a name to submit your score ({score}).
        </p>
      )}
      {isSubmitted ? (
        <p className="mt-2 text-sm">
          You scored #{submission?.rank ?? "?"} on the{" "}
          <code>{getDifficultyLabels(difficulty)}</code> mode leaderboard!
        </p>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="mt-2 space-y-2"
        >
          <input
            type="text"
            aria-label="Player name"
            placeholder="Your name"
            maxLength={20}
            {...register("playerName")}
            className="player-name__input w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2"
            disabled={isSubmitting}
          />
          {errors.playerName?.message && (
            <p className="text-xs text-red-300">{errors.playerName.message}</p>
          )}
          {submitError && <p className="text-xs text-red-300">{submitError}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit to leaderboard"}
          </Button>
        </form>
      )}
    </div>
  );
}
