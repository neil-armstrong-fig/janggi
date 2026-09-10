import type {Mover} from "@src/game/moves/types/Mover";
import {getPalaceStepMoves} from "@src/game/moves/utils/GetPalaceStepMoves";

/**
 * Where a general (궁/장) may go: one step along a drawn line, never outside its own palace.
 *
 * Nothing here knows about check. A general may currently walk onto a point the enemy attacks, and
 * that is a gap rather than a rule — see `docs/rules.md` §6.1.
 */
export const getLegalGeneralMoves: Mover = getPalaceStepMoves;
