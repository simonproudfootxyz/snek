import { samePosition } from "../lib/grid";
import type { Item, Position } from "./types";

export function collidesWithSelf(head: Position, snake: Position[]): boolean {
  return snake.some((segment) => samePosition(segment, head));
}

export function getCollectedItem(items: Item[], head: Position): Item | null {
  return items.find((item) => samePosition(item.position, head)) ?? null;
}
