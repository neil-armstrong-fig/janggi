import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {Position} from "@src/game/board/types/Position";
import {gameIsOver} from "@src/react/pages/game/components/board/utils/GameIsOver";
import {movesFrom} from "@src/game/MovesFrom";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {useMemo, useState} from "react";

/** A piece picked up, a piece under the pointer, and everywhere the one in question may go. */
export interface MoveSelection {
  readonly selected: Position | undefined;
  readonly hovered: Position | undefined;
  readonly destinations: readonly Position[];
  readonly tap: (position: Position) => void;
  readonly hover: (position: Position | undefined) => void;
}

/**
 * Picking a piece up and putting it down, which is the whole of how a game is played by touch.
 *
 * Tap-to-select rather than drag, because this is played on phones — and because it is the same
 * gesture a keyboard makes, so the two need no separate handling.
 *
 * Merely resting the pointer on a piece shows where it could go, which makes the board teach the
 * rules to someone who does not know them without committing them to anything. A piece actually in
 * hand outranks that, so the destinations do not change out from under a player mid-move. There is
 * no hover on a touch screen, where tapping does the same job.
 *
 * Which point is lit up is **UI state, not game state**, so it lives here rather than in the store.
 * The engine is asked what may happen and told what did; it is never asked to remember a highlight.
 * `movesFrom` is also the gate: `applyMove` throws on an illegal move, so nothing is ever offered
 * that it would refuse. A game stopped by two rested turns is the one case `movesFrom` cannot see —
 * the position still has moves in it and the game does not want them — so `gameIsOver` closes the
 * board over the top of it, and nothing is picked up or offered after that.
 */
export function useMoveSelection(game: GameState, onMove: (move: Move) => void): MoveSelection {
  const [selected, setSelected] = useState<Position | undefined>(undefined);
  const [hovered, setHovered] = useState<Position | undefined>(undefined);

  const over = gameIsOver(game);
  const asking = over ? undefined : (selected ?? hovered);
  const destinations = useMemo(() => (asking ? movesFrom(game, asking) : NOWHERE), [game, asking]);

  return {
    selected,
    hovered,
    destinations,
    hover: setHovered,

    tap(position: Position): void {
      if (over) return;

      if (selected && isAmong(destinations, position)) {
        onMove({from: selected, to: position});
        setSelected(undefined);
        return;
      }

      setSelected(pickedUpAt(game, selected, position));
    },
  };
}

/**
 * What is held after tapping a point that is not somewhere the current piece may go: the piece
 * standing there if it is this army's, and nothing otherwise — so tapping the enemy, an empty
 * point, or the held piece a second time all put it down.
 */
function pickedUpAt(game: GameState, selected: Position | undefined, position: Position): Position | undefined {
  if (selected && toPositionKey(selected) === toPositionKey(position)) return undefined;

  const piece = pieceAt(piecesByPosition(game.pieces), position);
  return piece?.side === game.sideToMove ? position : undefined;
}

function isAmong(positions: readonly Position[], position: Position): boolean {
  const key = toPositionKey(position);

  return positions.some(candidate => toPositionKey(candidate) === key);
}

/** A stable empty list, so nothing downstream re-renders because a new one was built. */
const NOWHERE: readonly Position[] = [];
