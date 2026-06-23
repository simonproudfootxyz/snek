import type { Difficulty, GameSettings, ItemType } from "./types";

export const BOARD_COLS = 20;
export const BOARD_ROWS = 20;

export const SCORE_BY_ITEM: Record<ItemType, number> = {
  good: 10,
  bonus: 30,
  bad: 0,
};

const BASE_SETTINGS: Omit<GameSettings, "baseTicksPerMove"> = {
  cols: BOARD_COLS,
  rows: BOARD_ROWS,
  wrapWalls: false,
  speedStepEvery: 60,
  speedStepAmount: 1,
  minTicksPerMove: 5,
  bonusSpawnEvery: 28,
  bonusLifetime: 18,
  badSpawnEvery: 20,
  badExpiresAfterGoodCollected: 5,
};

const BASE_TICKS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  normal: 1000 / 150,
  hard: 1000 / 130,
};

export function getSettingsForDifficulty(difficulty: Difficulty): GameSettings {
  return {
    ...BASE_SETTINGS,
    baseTicksPerMove: BASE_TICKS_BY_DIFFICULTY[difficulty],
  };
}
