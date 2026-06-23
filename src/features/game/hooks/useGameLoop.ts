"use client";

import { useEffect, useRef } from "react";

interface UseGameLoopOptions {
  isRunning: boolean;
  msPerTick: number;
  onTick: () => void;
}

export function useGameLoop({ isRunning, msPerTick, onTick }: UseGameLoopOptions): void {
  const tickRef = useRef(onTick);

  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    let rafId = 0;
    let accumulator = 0;
    let previous = performance.now();

    const loop = (now: number) => {
      accumulator += now - previous;
      previous = now;

      while (accumulator >= msPerTick) {
        tickRef.current();
        accumulator -= msPerTick;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isRunning, msPerTick]);
}
