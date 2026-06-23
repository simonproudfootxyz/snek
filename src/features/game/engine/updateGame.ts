import { isOppositeDirection, move, samePosition } from "../lib/grid";
import { collidesWithSelf, getCollectedItem } from "./collision";
import { scoreDelta } from "./scoring";
import { spawnItem } from "./spawn";
import type { Direction, GameState, Item } from "./types";

function isOutOfBounds(state: GameState, x: number, y: number): boolean {
  return x < 0 || y < 0 || x >= state.settings.cols || y >= state.settings.rows;
}

function collidesWithStructure(state: GameState, x: number, y: number): boolean {
  return state.structures.some((structureCell) => structureCell.x === x && structureCell.y === y);
}

function clampHeadToBoard(state: GameState, x: number, y: number) {
  if (!state.settings.wrapWalls) {
    return { x, y };
  }

  const wrappedX = (x + state.settings.cols) % state.settings.cols;
  const wrappedY = (y + state.settings.rows) % state.settings.rows;
  return { x: wrappedX, y: wrappedY };
}

function nextTicksPerMove(state: GameState, score: number): number {
  const speedIncrements = Math.floor(score / state.settings.speedStepEvery);
  const candidate =
    state.settings.baseTicksPerMove - speedIncrements * state.settings.speedStepAmount;
  return Math.max(state.settings.minTicksPerMove, candidate);
}

function ensureGoodItem(state: GameState): GameState {
  const hasGoodItem = state.items.some((item) => item.type === "good");
  if (hasGoodItem) {
    return state;
  }

  const [goodItem, nextSeed] = spawnItem(state, "good", state.rngSeed);
  if (!goodItem) {
    return { ...state, rngSeed: nextSeed };
  }

  return {
    ...state,
    items: [...state.items, goodItem],
    rngSeed: nextSeed,
  };
}

function maybeSpawnBonus(state: GameState): GameState {
  const hasBonus = state.items.some((item) => item.type === "bonus");
  if (hasBonus || state.tick === 0 || state.tick % state.settings.bonusSpawnEvery !== 0) {
    return state;
  }

  const [bonus, nextSeed] = spawnItem(state, "bonus", state.rngSeed);
  if (!bonus) {
    return { ...state, rngSeed: nextSeed };
  }

  return {
    ...state,
    items: [...state.items, bonus],
    rngSeed: nextSeed,
  };
}

function maybeSpawnYellow(state: GameState): GameState {
  const hasYellow = state.items.some((item) => item.type === "yellow");
  if (hasYellow || state.tick === 0 || state.tick % state.settings.yellowSpawnEvery !== 0) {
    return state;
  }

  const [yellow, nextSeed] = spawnItem(state, "yellow", state.rngSeed);
  if (!yellow) {
    return { ...state, rngSeed: nextSeed };
  }

  return {
    ...state,
    items: [...state.items, yellow],
    rngSeed: nextSeed,
  };
}

function maybeSpawnBad(state: GameState): GameState {
  const badItemCount = state.items.filter((item) => item.type === "bad").length;
  const progression = Math.floor(state.tick / 80);
  const maxBadItems = Math.min(9, 3 + progression);
  const spawnEvery = Math.max(8, state.settings.badSpawnEvery - progression * 2);
  if (badItemCount >= maxBadItems || state.tick === 0 || state.tick % spawnEvery !== 0) {
    return state;
  }

  const [bad, nextSeed] = spawnItem(state, "bad", state.rngSeed);
  if (!bad) {
    return { ...state, rngSeed: nextSeed };
  }

  return {
    ...state,
    items: [...state.items, bad],
    rngSeed: nextSeed,
  };
}

function removeExpiredItems(items: Item[], tick: number, goodCollected: number): Item[] {
  return items.filter((item) => {
    const expiredByTick = Boolean(item.expiresAtTick && item.expiresAtTick <= tick);
    const expiredByGreens = Boolean(
      item.type === "bad" &&
        item.expiresAtGoodCount !== undefined &&
        goodCollected >= item.expiresAtGoodCount,
    );
    return !(expiredByTick || expiredByGreens);
  });
}

export function queueDirection(state: GameState, direction: Direction): GameState {
  if (state.phase === "gameover") {
    return state;
  }

  const current = state.queuedDirection ?? state.direction;
  if (isOppositeDirection(current, direction) || current === direction) {
    return state;
  }

  return {
    ...state,
    queuedDirection: direction,
  };
}

export function tickGame(state: GameState): GameState {
  if (state.phase !== "running") {
    return state;
  }

  const tick = state.tick + 1;
  const nextDirection =
    state.queuedDirection && !isOppositeDirection(state.direction, state.queuedDirection)
      ? state.queuedDirection
      : state.direction;
  const rawHead = move(state.snake[0], nextDirection);

  if (!state.settings.wrapWalls && isOutOfBounds(state, rawHead.x, rawHead.y)) {
    return {
      ...state,
      phase: "gameover",
      tick,
      queuedDirection: null,
      highScore: Math.max(state.highScore, state.score),
    };
  }

  const nextHead = clampHeadToBoard(state, rawHead.x, rawHead.y);
  if (collidesWithStructure(state, nextHead.x, nextHead.y)) {
    return {
      ...state,
      phase: "gameover",
      tick,
      queuedDirection: null,
      highScore: Math.max(state.highScore, state.score),
    };
  }

  const collectedItem = getCollectedItem(state.items, nextHead);

  let nextSnake = [nextHead, ...state.snake];
  const grows = collectedItem?.type === "good" || collectedItem?.type === "bonus";
  if (!grows) {
    nextSnake = nextSnake.slice(0, -1);
  }

  if (collectedItem?.type === "yellow" && nextSnake.length > 1) {
    nextSnake = nextSnake.slice(0, -1);
  }

  if (collidesWithSelf(nextHead, nextSnake.slice(1))) {
    return {
      ...state,
      phase: "gameover",
      tick,
      queuedDirection: null,
      highScore: Math.max(state.highScore, state.score),
    };
  }

  if (collectedItem?.type === "bad") {
    return {
      ...state,
      phase: "gameover",
      tick,
      snake: nextSnake,
      direction: nextDirection,
      queuedDirection: null,
      highScore: Math.max(state.highScore, state.score),
    };
  }

  const score = state.score + (collectedItem ? scoreDelta(collectedItem.type) : 0);
  const goodCollected = state.goodCollected + (collectedItem?.type === "good" ? 1 : 0);
  const ticksPerMove = nextTicksPerMove(state, score);
  const items = removeExpiredItems(state.items, tick, goodCollected).filter(
    (item) => !samePosition(item.position, nextHead),
  );

  let nextState: GameState = {
    ...state,
    tick,
    score,
    goodCollected,
    highScore: Math.max(state.highScore, score),
    ticksPerMove,
    direction: nextDirection,
    queuedDirection: null,
    snake: nextSnake,
    items,
  };

  nextState = ensureGoodItem(nextState);
  nextState = maybeSpawnBonus(nextState);
  nextState = maybeSpawnYellow(nextState);
  nextState = maybeSpawnBad(nextState);

  return nextState;
}
