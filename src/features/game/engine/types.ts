export type Direction = "up" | "down" | "left" | "right";

export type ItemType = "good" | "bonus" | "bad" | "yellow";

export type GamePhase = "idle" | "running" | "paused" | "gameover";

export type Difficulty = "normal" | "hard" | "puzzle" | "very-hard";
export const difficultyLabels: Record<Difficulty, string> = {
  normal: "Normal",
  hard: "Hard",
  puzzle: "Harderer",
  "very-hard": "Diabolical",
};

export interface Position {
  x: number;
  y: number;
}

export interface Item {
  id: string;
  type: ItemType;
  position: Position;
  expiresAtTick?: number;
  expiresAtGoodCount?: number;
}

export interface GameSettings {
  cols: number;
  rows: number;
  wrapWalls: boolean;
  baseTicksPerMove: number;
  speedStepEvery: number;
  speedStepAmount: number;
  minTicksPerMove: number;
  bonusSpawnEvery: number;
  bonusLifetime: number;
  yellowSpawnEvery: number;
  yellowLifetime: number;
  badSpawnEvery: number;
  badExpiresAfterGoodCollected: number;
}

export interface GameState {
  phase: GamePhase;
  score: number;
  highScore: number;
  lastScore: number;
  goodCollected: number;
  tick: number;
  ticksPerMove: number;
  direction: Direction;
  queuedDirection: Direction | null;
  snake: Position[];
  items: Item[];
  rngSeed: number;
  settings: GameSettings;
  difficulty: Difficulty;
  structures: Position[];
}
