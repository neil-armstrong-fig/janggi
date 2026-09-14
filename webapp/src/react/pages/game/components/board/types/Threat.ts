import type {Position} from "@src/game/board/types/Position";

/** A check on the board: the general under attack, and where every piece attacking it stands. */
export interface Threat {
  readonly general: Position;
  readonly attackers: readonly Position[];
}
