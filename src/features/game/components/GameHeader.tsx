import Link from "next/link";
import { difficultyLabels } from "../engine/types";
import "./GameHeader.css";

export function GameHeader({
  byLine = "Good old fashioned arcade fun",
}: {
  byLine?: string;
}) {
  const puzzleDifficultyLabel = difficultyLabels.puzzle;
  const diabolicalDifficultyLabel = difficultyLabels.diabolical;

  return (
    <header className="game-header">
      <p className="game-header-kicker">{byLine}</p>
      <h1 className="game-header-title" title="Snek, The Game">
        <Link className="game-header__title-link" href="/">
          Snek, The Game
        </Link>
      </h1>
      <p className="game-header-description">
        Collect green, blue, and yellow items for points, avoid red items, and
        survive as the game speeds up. Structures appear in{" "}
        <code>{puzzleDifficultyLabel}</code> and{" "}
        <code>{diabolicalDifficultyLabel}</code> modes.
      </p>
    </header>
  );
}
