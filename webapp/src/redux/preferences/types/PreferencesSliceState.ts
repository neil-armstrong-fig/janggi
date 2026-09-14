import type {BoardStyleName} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * How a player likes the game drawn and heard: the board, the piece set, the movable-piece mark, how
 * much the board moves, and how loud the sound effects and the music are.
 *
 * None of it is part of the game — changing one never deals anything — which is what keeps it out of
 * `GameSliceState`. It is in the store at all because three sections of the page read it and one
 * changes it, and a slice is where that is said once rather than drilled through `GamePage`.
 *
 * Held **by name**, not as the style objects the board draws with. `src/redux/` may not reach into
 * `src/react/`, where those objects live, and a name is also what a picker shows, what an acceptance
 * test asks for, and what survives being written to storage. `usePreferences` looks each one up.
 */
export interface PreferencesSliceState {
  readonly boardStyle: BoardStyleName;
  readonly pieceSet: PieceSetName;
  readonly movableHighlight: MovableHighlightName;
  readonly effects: EffectsName;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
}
