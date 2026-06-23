import type { Direction, Position } from "../engine/types";

export function toKey(position: Position): string {
  return `${position.x}:${position.y}`;
}

export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function move(position: Position, direction: Direction): Position {
  if (direction === "up") return { x: position.x, y: position.y - 1 };
  if (direction === "down") return { x: position.x, y: position.y + 1 };
  if (direction === "left") return { x: position.x - 1, y: position.y };
  return { x: position.x + 1, y: position.y };
}

export function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}
