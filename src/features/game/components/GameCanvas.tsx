"use client";

import { useEffect, useRef } from "react";
import type { GameState } from "../engine/types";

const MAX_BOARD_SIZE = 440;

interface GameCanvasProps {
  state: GameState;
}

export function GameCanvas({ state }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const width = Math.min(MAX_BOARD_SIZE, canvas.clientWidth || MAX_BOARD_SIZE);
    const height = (width * state.settings.rows) / state.settings.cols;
    const cellWidth = width / state.settings.cols;
    const cellHeight = height / state.settings.rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    const snakeInset = Math.max(1, cellSize * 0.09);
    const structureInset = Math.max(0.75, cellSize * 0.07);
    const itemRadius = cellSize * 0.31;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    context.fillStyle = "#0f1118";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(255, 255, 255, 0.04)";
    context.lineWidth = 1;
    for (let y = 0; y <= state.settings.rows; y += 1) {
      context.beginPath();
      context.moveTo(0, y * cellHeight);
      context.lineTo(width, y * cellHeight);
      context.stroke();
    }
    for (let x = 0; x <= state.settings.cols; x += 1) {
      context.beginPath();
      context.moveTo(x * cellWidth, 0);
      context.lineTo(x * cellWidth, height);
      context.stroke();
    }

    for (const segment of state.snake) {
      context.fillStyle = "#6ce0b7";
      context.fillRect(
        segment.x * cellWidth + snakeInset,
        segment.y * cellHeight + snakeInset,
        cellWidth - snakeInset * 2,
        cellHeight - snakeInset * 2,
      );
    }

    for (const structure of state.structures ?? []) {
      context.fillStyle = "#8b8f9b";
      context.fillRect(
        structure.x * cellWidth + structureInset,
        structure.y * cellHeight + structureInset,
        cellWidth - structureInset * 2,
        cellHeight - structureInset * 2,
      );
    }

    for (const item of state.items) {
      if (item.type === "good") context.fillStyle = "#8ae35f";
      if (item.type === "bonus") context.fillStyle = "#56b3ff";
      if (item.type === "bad") context.fillStyle = "#ff6a88";

      context.beginPath();
      context.arc(
        item.position.x * cellWidth + cellWidth / 2,
        item.position.y * cellHeight + cellHeight / 2,
        itemRadius,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full max-w-[440px] rounded-xl border border-white/12 bg-[#0f1118] shadow-[0_14px_35px_rgba(0,0,0,0.42)] game-play-area"
      aria-label="Game board"
    />
  );
}
