import type {ArmyPieceSets} from "@src/styles/piece-sets/types/ArmyPieceSets";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {withArmyOf} from "@src/styles/piece-sets/WithArmyOf";

/**
 * The one set the board is drawn with, given the set each army wears: Cho's set with Han drawn as Han's set
 * draws it. Where they are the same set it is that set, untouched.
 *
 * How the pieces are handled — the held shadow, the outline under the pointer — is one setting for the whole
 * board and comes from Cho's set, the army a player usually is.
 */
export function combinedPieceSet({han, cho}: ArmyPieceSets): PieceSetStyle {
  if (han.name === cho.name) return cho;

  return {
    ...withArmyOf(cho, han, "han"),
    name: `${han.name} and ${cho.name}`,
  };
}
