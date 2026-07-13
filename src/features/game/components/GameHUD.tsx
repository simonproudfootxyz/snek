import type { GameState } from "../engine/types";
import "./GameHUD.css";

interface GameHUDProps {
  state: GameState;
}

export function GameHUD({ state }: GameHUDProps) {
  const speed = Math.round((1000 / state.ticksPerMove) * 10) / 10;

  return (
    <div className="game-hud">
      <div className="game-hud__item">
        <p className="game-hud__label">Score</p>
        <p className="game-hud__value">{state.score}</p>
      </div>
      <div className="game-hud__item">
        <p className="game-hud__label">Best Score</p>
        <p className="game-hud__value">{state.highScore}</p>
      </div>
      <div className="game-hud__item">
        <p className="game-hud__label">Last Score</p>
        <p className="game-hud__value">{state.lastScore}</p>
      </div>
      <div className="game-hud__item">
        <p className="game-hud__label">Speed</p>
        <p className="game-hud__value">{speed}</p>
      </div>
    </div>
  );
}
