import type {GameState} from "@src/game/types/GameState";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {Transition} from "@src/game/record/types/Transition";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * What the turn from `before` to `after` did — a move and what it took, a rested turn, a called
 * bikjang or an agreed draw — or undefined where no single turn leads from one to the other.
 *
 * **Derived rather than recorded.** A record keeps positions, not moves (`types/PlayedGame.ts`), and
 * `GameState` keeps no last move, because no rule asks for one. Yet everything a board wants to say
 * about a turn — which piece travelled, from where, and what it knocked off — is already written in
 * the two positions, since janggi has no promotion, no castling and no capture in passing: the
 * moving army has exactly one piece that left a point and exactly one that arrived on another.
 *
 * **It reads forwards only.** Handed a move the wrong way round, the army that was to move in
 * `before` has moved nothing, and the answer is undefined — taking a turn back is not a turn. A
 * caller animating an undo reverses the transition it already has rather than asking for this one.
 */
export function transitionBetween(before: GameState, after: GameState): Transition | undefined {
  if (!before.bikjangCalled && after.bikjangCalled && before.sideToMove === after.sideToMove) {
    return {kind: "bikjangCalled"};
  }

  if (!before.drawAgreed && after.drawAgreed && before.sideToMove === after.sideToMove) {
    return {kind: "drawAgreed"};
  }

  if (after.sideToMove === before.sideToMove) return undefined;

  if (after.consecutivePasses === before.consecutivePasses + 1) return {kind: "passed", side: before.sideToMove};

  return movedBetween(before, after);
}

function movedBetween(before: GameState, after: GameState): Transition | undefined {
  const side = before.sideToMove;

  const left = missingFrom(armyOf(before, side), armyOf(after, side));
  const arrived = missingFrom(armyOf(after, side), armyOf(before, side));

  const from = left[0];
  const to = arrived[0];
  if (left.length !== 1 || arrived.length !== 1 || !from || !to) return undefined;

  return {
    kind: "moved",
    move: {from: from.position, to: to.position},
    mover: from.piece,
    taken: pieceAt(piecesByPosition(before.pieces), to.position),
  };
}

/** The pieces of `these` that stand nowhere in `those` — the same kind, on the same point. */
function missingFrom(these: readonly PlacedPiece[], those: readonly PlacedPiece[]): PlacedPiece[] {
  const standing = new Set(those.map(placedKey));

  return these.filter(placed => !standing.has(placedKey(placed)));
}

function armyOf(state: GameState, side: Side): readonly PlacedPiece[] {
  return state.pieces.filter(({piece}) => piece.side === side);
}

function placedKey({piece, position}: PlacedPiece): string {
  return `${toPieceKey(piece)}@${toPositionKey(position)}`;
}
