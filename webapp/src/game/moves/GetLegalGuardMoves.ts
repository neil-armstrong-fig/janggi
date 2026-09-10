import type {Mover} from "@src/game/moves/types/Mover";
import {getPalaceStepMoves} from "@src/game/moves/utils/GetPalaceStepMoves";

/**
 * Where a guard (사) may go. Identical to the general in every respect, including being unable to
 * leave the palace.
 *
 * It keeps its own name rather than sharing the general's because the piece is a guard, and a
 * dispatch table with a `guard` entry pointing at `getLegalGeneralMoves` would read as a mistake. The rule
 * they share is stated once, next door.
 */
export const getLegalGuardMoves: Mover = getPalaceStepMoves;
