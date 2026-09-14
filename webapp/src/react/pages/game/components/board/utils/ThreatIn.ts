import type {GameState} from "@src/game/types/GameState";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";
import {attackersOf} from "@src/game/check/AttackersOf";

/**
 * The check on the board, if there is one: the general of the army to move, and every piece attacking
 * it. Undefined where that general is not attacked.
 *
 * Only ever asked of the army to move. No move that leaves its own general attacked is ever offered, so
 * the army that has just moved cannot be in check. It is still answered at a mate, where the attack is
 * the whole of the story.
 */
export function threatIn(game: GameState): Threat | undefined {
  const attackers = attackersOf(game, game.sideToMove);
  if (attackers.length === 0) return undefined;

  const general = game.pieces.find(({piece}) => piece.side === game.sideToMove && piece.type === "general");
  if (!general) return undefined;

  return {general: general.position, attackers};
}
