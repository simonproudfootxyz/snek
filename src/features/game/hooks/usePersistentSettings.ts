"use client";

import { useEffect } from "react";

const HIGH_SCORE_KEY = "snek-high-score";

export function readHighScore(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function usePersistHighScore(highScore: number): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
  }, [highScore]);
}
