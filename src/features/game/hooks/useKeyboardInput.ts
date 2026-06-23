"use client";

import { useEffect } from "react";
import type { Direction } from "../engine/types";

function mapKeyToDirection(key: string): Direction | null {
  if (key === "ArrowUp" || key.toLowerCase() === "w") return "up";
  if (key === "ArrowDown" || key.toLowerCase() === "s") return "down";
  if (key === "ArrowLeft" || key.toLowerCase() === "a") return "left";
  if (key === "ArrowRight" || key.toLowerCase() === "d") return "right";
  return null;
}

export function useKeyboardInput(onDirection: (direction: Direction) => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = mapKeyToDirection(event.key);
      if (!direction) {
        return;
      }

      event.preventDefault();
      onDirection(direction);
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onDirection]);
}
