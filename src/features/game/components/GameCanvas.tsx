"use client";

import { useEffect, useRef } from "react";
import type { GameState } from "../engine/types";

const CELL_SIZE = 22;

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

    const width = state.settings.cols * CELL_SIZE;
    const height = state.settings.rows * CELL_SIZE;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    context.fillStyle = "#0f1118";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(255, 255, 255, 0.04)";
    context.lineWidth = 1;
    for (let y = 0; y <= state.settings.rows; y += 1) {
      context.beginPath();
      context.moveTo(0, y * CELL_SIZE);
      context.lineTo(width, y * CELL_SIZE);
      context.stroke();
    }
    for (let x = 0; x <= state.settings.cols; x += 1) {
      context.beginPath();
      context.moveTo(x * CELL_SIZE, 0);
      context.lineTo(x * CELL_SIZE, height);
      context.stroke();
    }

    for (const segment of state.snake) {
      context.fillStyle = "#6ce0b7";
      context.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
      );
    }

    for (const structure of state.structures ?? []) {
      context.fillStyle = "#8b8f9b";
      context.fillRect(
        structure.x * CELL_SIZE + 1.5,
        structure.y * CELL_SIZE + 1.5,
        CELL_SIZE - 3,
        CELL_SIZE - 3,
      );
    }

    for (const item of state.items) {
      if (item.type === "good") context.fillStyle = "#8ae35f";
      if (item.type === "bonus") context.fillStyle = "#56b3ff";
      if (item.type === "bad") context.fillStyle = "#ff6a88";

      context.beginPath();
      context.arc(
        item.position.x * CELL_SIZE + CELL_SIZE / 2,
        item.position.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE * 0.31,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl border border-white/12 bg-[#0f1118] shadow-[0_14px_35px_rgba(0,0,0,0.42)] game-play-area"
      aria-label="Game board"
    />
  );
}
