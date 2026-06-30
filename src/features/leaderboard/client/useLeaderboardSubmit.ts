"use client";

import { useState } from "react";
import type {
  SubmitLeaderboardEntrySuccessResponse,
  SubmitLeaderboardRequest,
} from "../domain/types";
import { postLeaderboardEntry } from "./api";

interface UseLeaderboardSubmitResult {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  submission: SubmitLeaderboardEntrySuccessResponse | null;
  submitLeaderboardEntry: (
    payload: SubmitLeaderboardRequest,
  ) => Promise<SubmitLeaderboardEntrySuccessResponse | null>;
}

export function useLeaderboardSubmit(): UseLeaderboardSubmitResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submission, setSubmission] =
    useState<SubmitLeaderboardEntrySuccessResponse | null>(null);

  async function submitLeaderboardEntry(payload: SubmitLeaderboardRequest) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await postLeaderboardEntry(payload);
      setSubmission(result);
      setIsSubmitted(true);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit score";
      setSubmitError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    isSubmitted,
    submitError,
    submission,
    submitLeaderboardEntry,
  };
}
