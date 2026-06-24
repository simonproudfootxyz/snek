import { getSettingsForDifficulty } from "./constants";
import { spawnItem } from "./spawn";
import { toKey } from "../lib/grid";
import { randomInt } from "../lib/random";
import type { Difficulty, GameState, Position } from "./types";

interface InitialOptions {
  difficulty: Difficulty;
  highScore?: number;
  lastScore?: number;
  seed?: number;
}

const STRUCTURE_MIN_COUNT = 4;
const STRUCTURE_MAX_COUNT = 6;
const STRUCTURE_MIN_SIZE = 3;
const STRUCTURE_MAX_SIZE = 7;
const STRUCTURE_ATTEMPTS = 40;

function createLine(length: number, horizontal: boolean): Position[] {
  return Array.from({ length }, (_, index) => ({
    x: horizontal ? index : 0,
    y: horizontal ? 0 : index,
  }));
}

function createRectangle(length: number, vertical: boolean): Position[] {
  const width = vertical ? 2 : Math.min(3, length - 1);
  const height = Math.ceil(length / width);
  const cells: Position[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (cells.length >= length) {
        return cells;
      }
      cells.push({ x, y });
    }
  }

  return cells;
}

function createLShape(length: number, horizontalFirst: boolean): Position[] {
  const armA = Math.max(2, Math.ceil(length / 2));
  const armB = Math.max(2, length - armA + 1);
  const cells: Position[] = [];

  for (let index = 0; index < armA; index += 1) {
    cells.push(horizontalFirst ? { x: index, y: 0 } : { x: 0, y: index });
  }

  for (let index = 1; index < armB; index += 1) {
    cells.push(
      horizontalFirst ? { x: armA - 1, y: index } : { x: index, y: armA - 1 },
    );
  }

  return cells.slice(0, length);
}

function createStructureShape(
  seed: number,
  size: number,
): [Position[], number] {
  const [shapeKind, seedAfterKind] = randomInt(seed, 3);
  const [orientation, nextSeed] = randomInt(seedAfterKind, 2);
  const isHorizontal = orientation === 0;

  if (shapeKind === 0) {
    return [createLine(size, isHorizontal), nextSeed];
  }

  if (shapeKind === 1) {
    return [createRectangle(size, !isHorizontal), nextSeed];
  }

  return [createLShape(size, isHorizontal), nextSeed];
}

function generateStructures(state: GameState): [Position[], number] {
  if (state.difficulty !== "puzzle" && state.difficulty !== "very-hard") {
    return [[], state.rngSeed];
  }

  const occupied = new Set(state.snake.map(toKey));
  const blocked = new Set(state.snake.map(toKey));
  const structures: Position[] = [];
  let seed = state.rngSeed;
  const [targetOffset, seedAfterOffset] = randomInt(
    seed,
    STRUCTURE_MAX_COUNT - STRUCTURE_MIN_COUNT + 1,
  );
  seed = seedAfterOffset;
  const targetCount = STRUCTURE_MIN_COUNT + targetOffset;

  for (
    let structureIndex = 0;
    structureIndex < targetCount;
    structureIndex += 1
  ) {
    let placed = false;

    for (
      let attempt = 0;
      attempt < STRUCTURE_ATTEMPTS && !placed;
      attempt += 1
    ) {
      const [sizeOffset, seedAfterSize] = randomInt(
        seed,
        STRUCTURE_MAX_SIZE - STRUCTURE_MIN_SIZE + 1,
      );
      seed = seedAfterSize;
      const size = STRUCTURE_MIN_SIZE + sizeOffset;
      const [shape, seedAfterShape] = createStructureShape(seed, size);
      seed = seedAfterShape;

      const maxX = Math.max(...shape.map((cell) => cell.x));
      const maxY = Math.max(...shape.map((cell) => cell.y));
      const [originX, seedAfterX] = randomInt(seed, state.settings.cols - maxX);
      seed = seedAfterX;
      const [originY, seedAfterY] = randomInt(seed, state.settings.rows - maxY);
      seed = seedAfterY;

      const translated = shape.map((cell) => ({
        x: cell.x + originX,
        y: cell.y + originY,
      }));

      const overlaps = translated.some((cell) => blocked.has(toKey(cell)));
      if (overlaps) {
        continue;
      }

      for (const cell of translated) {
        occupied.add(toKey(cell));

        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const x = cell.x + dx;
            const y = cell.y + dy;
            if (x < 0 || y < 0 || x >= state.settings.cols || y >= state.settings.rows) {
              continue;
            }
            blocked.add(toKey({ x, y }));
          }
        }
      }
      structures.push(...translated);
      placed = true;
    }
  }

  return [structures, seed];
}

export function createInitialState(options?: InitialOptions): GameState {
  const difficulty = options?.difficulty ?? "normal";
  const settings = getSettingsForDifficulty(difficulty);
  const seed = options?.seed ?? Date.now();
  const centerX = Math.floor(settings.cols / 2);
  const centerY = Math.floor(settings.rows / 2);

  const baseState: GameState = {
    phase: "idle",
    score: 0,
    highScore: options?.highScore ?? 0,
    lastScore: options?.lastScore ?? 0,
    goodCollected: 0,
    tick: 0,
    ticksPerMove: settings.baseTicksPerMove,
    direction: "right",
    queuedDirection: null,
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ],
    items: [],
    rngSeed: seed,
    settings,
    difficulty,
    structures: [],
  };

  const [structures, seedAfterStructures] = generateStructures(baseState);
  baseState.structures = structures;
  baseState.rngSeed = seedAfterStructures;

  const [initialGoodItem, nextSeed] = spawnItem(
    baseState,
    "good",
    baseState.rngSeed,
  );
  if (initialGoodItem) {
    baseState.items.push(initialGoodItem);
  }
  baseState.rngSeed = nextSeed;

  return baseState;
}
