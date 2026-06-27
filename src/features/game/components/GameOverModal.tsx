"use client";

import { useMemo, useState } from "react";
import "./GameOverModal.css";
import { Difficulty, difficultyLabels } from "../engine/types";

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
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const nonNormalMode = difficulty !== "normal";
  const difficultyLabel = difficultyLabels[difficulty];
  const difficultySuffix = nonNormalMode ? ` in ${difficultyLabel} mode!` : "!";
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
      return "Awesome! You're doing great!";
    }
    return "Let's f^#%ing go! Run it back!";
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-[2px]">
      <div className="w-[340px] rounded-xl border border-white/15 bg-[#161a24] p-6 text-center game-over-modal">
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
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Share on X
          </a>
          <a
            href={blueskyShareUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Share on Bluesky
          </a>
          <a
            href={redditShareUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Share on Reddit
          </a>
          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            {copied ? "Copied!" : "Share Results"}
          </button>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#10141b] transition hover:bg-emerald-300"
        >
          Play again
        </button>
      </div>
    </div>
  );
}
