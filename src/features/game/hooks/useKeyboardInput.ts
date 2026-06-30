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

interface UseKeyboardInputOptions {
  onDirection: (direction: Direction) => void;
  onSpace?: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const editableAncestor = target.closest(
    'input, textarea, select, [contenteditable="true"]',
  );
  return editableAncestor !== null;
}

export function useKeyboardInput({ onDirection, onSpace }: UseKeyboardInputOptions): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        onSpace?.();
        return;
      }

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
  }, [onDirection, onSpace]);
}
