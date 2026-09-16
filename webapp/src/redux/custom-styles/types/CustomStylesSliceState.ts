import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/**
 * The styles the player has made or been given: board styles and piece sets, each the same plain data
 * a built-in is, kept whole because there is nowhere else they come from.
 *
 * **Only ever on this device.** A style is shared as a key a player copies and someone else pastes; no
 * server ever sees one, so there is nothing anybody has to moderate.
 */
export interface CustomStylesSliceState {
  readonly boards: readonly BoardStyle[];
  readonly pieceSets: readonly PieceSetStyle[];
}
