import { toKey } from "../lib/grid";
import { randomInt } from "../lib/random";
import type { GameSettings, Item, ItemType, Position } from "./types";

interface SpawnState {
  snake: Position[];
  items: Item[];
  settings: GameSettings;
  tick: number;
  goodCollected: number;
  structures: Position[];
}

export function spawnItem(
  state: SpawnState,
  type: ItemType,
  seed: number,
): [Item | null, number] {
  const occupied = new Set<string>([
    ...state.snake.map(toKey),
    ...state.items.map((item) => toKey(item.position)),
    ...state.structures.map(toKey),
  ]);
  const freeCells: Position[] = [];

  for (let y = 0; y < state.settings.rows; y += 1) {
    for (let x = 0; x < state.settings.cols; x += 1) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return [null, seed];
  }

  const [index, nextSeed] = randomInt(seed, freeCells.length);
  const position = freeCells[index];
  const item: Item = {
    id: `${type}-${state.tick}-${nextSeed}`,
    type,
    position,
    expiresAtTick:
      type === "bonus" ? state.tick + state.settings.bonusLifetime : undefined,
    expiresAtGoodCount:
      type === "bad"
        ? state.goodCollected + state.settings.badExpiresAfterGoodCollected
        : undefined,
  };

  return [item, nextSeed];
}
