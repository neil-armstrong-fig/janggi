import type {BoardLine} from "@src/react/pages/game/components/board/types/BoardLine";
import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The open file between the two generals, once a bikjang has been called on it, or undefined before then. */
export function bikjangLineIn(game: GameState): BoardLine | undefined {
  if (!game.bikjangCalled) return undefined;

  const han = generalOf(game, "han");
  const cho = generalOf(game, "cho");

  return han && cho ? {from: han, to: cho} : undefined;
}

function generalOf(game: GameState, side: Side): Position | undefined {
  return game.pieces.find(({piece}) => piece.side === side && piece.type === "general")?.position;
}
