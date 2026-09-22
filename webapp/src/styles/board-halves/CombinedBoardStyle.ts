import type {ArmyBoardStyles} from "@src/styles/board-halves/types/ArmyBoardStyles";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {withHalfOf} from "@src/styles/board-halves/WithHalfOf";

/**
 * The one board the game is drawn on, given the board each army wears: Cho's board with Han's half
 * drawn as Han's board draws it. Where they are the same board it is that board, untouched.
 *
 * The surface, the last-move marks, the bikjang line, the check colour and the hint colours are one
 * setting for the whole board and come from Cho's — the army a player usually is — the same way a
 * piece set's `handling` stays one setting rather than splitting per army.
 */
export function combinedBoardStyle({han, cho}: ArmyBoardStyles): BoardStyle {
  if (han.name === cho.name) return cho;

  return {...withHalfOf(cho, han, "han"), name: `${han.name} and ${cho.name}`};
}
