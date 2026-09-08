import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import {movesFrom} from "@src/game/MovesFrom";

/**
 * Every move the army to move may make, asked one piece at a time the way a player would.
 *
 * The measure of whether a game can go on: janggi has no stalemate, so an empty list is not a loss
 * by itself — a player with nothing to play passes. It is an empty list **while in check** that
 * ends a game. See `docs/rules.md` §6.1 and §6.3.
 */
export function legalMovesFor(state: GameState): readonly Move[] {
  return state.pieces
    .filter(({piece}) => piece.side === state.sideToMove)
    .flatMap(({position}) => movesFrom(state, position).map(to => ({from: position, to})));
}
