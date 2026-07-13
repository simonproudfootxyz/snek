"use client";

import { useMemo, useState } from "react";
import "./GameOverModal.css";
import { LeaderboardSubmitForm } from "@/features/leaderboard/components/LeaderboardSubmitForm";
import type { SubmitLeaderboardEntrySuccessResponse } from "@/features/leaderboard/domain/types";
import { LEADERBOARD_MIN_SCORE } from "@/features/leaderboard/domain/constants";
import { Difficulty, difficultyLabels } from "../engine/types";
import { InvertButton, PrimaryButton } from "@/features/ui/components/Button";
import Modal from "@/features/ui/components/Modal/Modal";
import { InvertLink } from "@/features/ui/components/Link";

interface GameOverModalProps {
  score: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

export function GameOverModal({
  score,
  difficulty,
  onRestart,
}: GameOverModalProps) {
  const [copied, setCopied] = useState(false);
  const [leaderboardPath, setLeaderboardPath] = useState<string | null>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const nonNormalMode = difficulty !== "normal";
  const difficultyLabel = difficultyLabels[difficulty];
  const difficultySuffix = nonNormalMode ? ` in ${difficultyLabel} mode!` : "!";
  const canSubmitToLeaderboard = score >= LEADERBOARD_MIN_SCORE;
  const shareMessageText = `Let's go! Just scored ${score} on Snek, The Game${difficultySuffix} Think you can beat me? ${origin}`;
  const shareMessage = useMemo(() => `${shareMessageText}`, [shareMessageText]);
  const twitterShareUrl = useMemo(
    () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    [shareMessage],
  );
  const blueskyShareUrl = useMemo(
    () =>
      `https://bsky.app/intent/compose?text=${encodeURIComponent(shareMessage)}`,
    [shareMessage],
  );
  const redditShareUrl = useMemo(() => {
    const fallbackUrl = "https://snek.game";
    const postUrl = origin || fallbackUrl;
    return `https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(shareMessage)}`;
  }, [origin, shareMessage]);

  async function handleCopy(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const getEndingQuip = (scoreValue: number): string => {
    if (scoreValue <= 0) {
      return "Better luck next time!";
    }
    if (scoreValue < 50) {
      return "You're getting the hang of it!";
    }
    if (scoreValue < 100) {
      return "Getting better, keep going!";
    }
    if (scoreValue < 200) {
      return "Yuuuuge! Keep it up!";
    }
    if (scoreValue < 300) {
      return "Party time! Excellent!";
    }
    return "Let's f^#%ing go! Run it back!";
  };

  function handleSubmissionSuccess(
    submission: SubmitLeaderboardEntrySuccessResponse,
  ) {
    setLeaderboardPath(submission.leaderboardPath);
  }

  return (
    <Modal size="sm" closeOnBackdrop={false} contained>
      <div className="w-[340px] text-center game-over-modal">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">
          Run ended, you scored:
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">{score}</p>
        <p className="mt-2 text-sm text-white/70">{getEndingQuip(score)}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noreferrer"
            className="button button--invert px-3 py-2 font-semibold"
          >
            Share on X
          </a>
          <a
            href={blueskyShareUrl}
            target="_blank"
            rel="noreferrer"
            className="button button--invert px-3 py-2 font-semibold"
          >
            Share on Bluesky
          </a>
          <a
            href={redditShareUrl}
            target="_blank"
            rel="noreferrer"
            className="button button--invert px-3 py-2 font-semibold"
          >
            Share on Reddit
          </a>
          <InvertButton
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="px-3 py-2 font-semibold"
          >
            {copied ? "Copied!" : "Share Results"}
          </InvertButton>
        </div>
        {canSubmitToLeaderboard ? (
          <LeaderboardSubmitForm
            score={score}
            difficulty={difficulty}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        ) : (
          <p className="mt-3 text-xs text-white/60">
            Reach {LEADERBOARD_MIN_SCORE}+ points to submit to the leaderboard.
          </p>
        )}
        <div className="mt-2 flex items-center justify-center gap-2">
          {leaderboardPath && (
            <InvertLink
              href={leaderboardPath}
              className="px-4 py-2 text-sm font-semibold"
            >
              View leaderboard
            </InvertLink>
          )}
          <PrimaryButton type="button" onClick={onRestart} className="px-4 py-2 text-sm">
            Play again
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}
