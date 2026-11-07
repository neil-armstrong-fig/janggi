import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/**
 * The styles the player has made or been given: board styles and piece sets, each the same plain data
 * a built-in is, kept whole because there is nowhere else they come from.
 *
 * **The player's own, and nobody else's.** A style reaches another player only as a key somebody copies and the
 * other pastes — there is no list of styles anyone can browse, so there is nothing to moderate. A player who signs in
 * has theirs kept with their account so they follow them between devices (`SyncData`), but that is theirs alone:
 * what the server holds is never shown to anyone else.
 */
export interface CustomStylesSliceState {
  readonly boards: readonly BoardStyle[];
  readonly pieceSets: readonly PieceSetStyle[];
}
