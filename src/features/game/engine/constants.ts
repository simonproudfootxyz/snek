import type { Difficulty, GameSettings, ItemType } from "./types";

export const BOARD_COLS = 20;
export const BOARD_ROWS = 20;

export const SCORE_BY_ITEM: Record<ItemType, number> = {
  good: 10,
  bonus: 20,
  bad: 0,
  yellow: -5,
};

const BASE_SETTINGS: Omit<GameSettings, "baseTicksPerMove"> = {
  cols: BOARD_COLS,
  rows: BOARD_ROWS,
  wrapWalls: false,
  speedStepEvery: 60,
  speedStepAmount: 1,
  minTicksPerMove: 4,
  bonusSpawnEvery: 20,
  bonusLifetime: 30,
  yellowSpawnEvery: 24,
  yellowLifetime: 18,
  badSpawnEvery: 20,
  badExpiresAfterGoodCollected: 5,
};

const BASE_TICKS_BY_DIFFICULTY: Record<Difficulty, number> = {
  normal: 1000 / 150,
  hard: 1000 / 150,
  puzzle: 1000 / 150,
  "very-hard": 1000 / 150,
};

export function getSettingsForDifficulty(difficulty: Difficulty): GameSettings {
  return {
    ...BASE_SETTINGS,
    baseTicksPerMove: BASE_TICKS_BY_DIFFICULTY[difficulty],
  };
}
