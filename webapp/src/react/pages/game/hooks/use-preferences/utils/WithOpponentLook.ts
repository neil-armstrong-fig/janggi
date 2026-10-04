import type {OpponentLook} from "@src/redux/online/types/OpponentLook";
import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {combinedBoardStyle} from "@src/styles/board-halves/CombinedBoardStyle";
import {combinedPieceSet} from "@src/styles/piece-sets/CombinedPieceSet";
import {opponentOf} from "@janggi/engine/utils/OpponentOf";

interface LookedAt {
  readonly ownSide: Side;
  readonly look: OpponentLook;
}

/**
 * The preferences as a game against a friend draws with them: each half of the board in its owner's board and each army in
 * its owner's pieces — this player's in their own, the friend's in the friend's. What the friend did not send, or sent and
 * failed to check out, stays the player's own.
 */
export function withOpponentLook(preferences: Preferences, {ownSide, look}: LookedAt): Preferences {
  const {boardStyle, pieceSet} = look;
  const friendsSide = opponentOf(ownSide);
  const armyBoardStyles =
    boardStyle === undefined
      ? preferences.armyBoardStyles
      : {...preferences.armyBoardStyles, [friendsSide]: boardStyle};
  const armyPieceSets =
    pieceSet === undefined ? preferences.armyPieceSets : {...preferences.armyPieceSets, [friendsSide]: pieceSet};

  return {
    ...preferences,
    boardStyle: boardStyle === undefined ? preferences.boardStyle : combinedBoardStyle(armyBoardStyles),
    armyBoardStyles,
    armyPieceSets,
    pieceStyle: pieceSet === undefined ? preferences.pieceStyle : combinedPieceSet(armyPieceSets),
  };
}
