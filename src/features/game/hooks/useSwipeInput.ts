"use client";

import { useMemo, useRef } from "react";
import type { TouchEventHandler } from "react";
import type { Direction } from "../engine/types";

const SWIPE_THRESHOLD = 18;

export function useSwipeInput(onDirection: (direction: Direction) => void): {
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
} {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  return useMemo(
    () => ({
      onTouchStart: (event) => {
        const touch = event.changedTouches[0];
        startRef.current = { x: touch.clientX, y: touch.clientY };
      },
      onTouchEnd: (event) => {
        if (!startRef.current) {
          return;
        }

        const touch = event.changedTouches[0];
        const dx = touch.clientX - startRef.current.x;
        const dy = touch.clientY - startRef.current.y;
        startRef.current = null;

        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
          return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          onDirection(dx > 0 ? "right" : "left");
          return;
        }

        onDirection(dy > 0 ? "down" : "up");
      },
    }),
    [onDirection],
  );
}
