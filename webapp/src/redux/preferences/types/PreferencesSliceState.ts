import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {Opacity} from "@janggi/shared/janggi/settings/Opacity";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * How a player likes the game drawn and heard: the board, the piece set, the movable-piece mark, the
 * bikjang hint, how much the board moves, how loud the sound effects and the music are, and how
 * see-through the settings sheet's own panel is.
 *
 * None of it is part of the game — changing one never deals anything — which is what keeps it out of
 * `GameSliceState`. It is in the store at all because three sections of the page read it and one
 * changes it, and a slice is where that is said once rather than drilled through `GamePage`.
 *
 * Held **by name**, not as the style objects the board draws with. `src/redux/` may not reach into
 * `src/react/`, where the built-in objects live, and a name is also what a picker shows, what an
 * acceptance test asks for, and what survives being written to storage. `usePreferences` looks each one
 * up.
 *
 * The board style and the piece set are plain strings rather than the built-in unions, because either
 * may name one of the player's own styles. A name held here is therefore not a promise that anything is
 * there to wear — the style may since have been deleted, or a save may have locked it again — so the
 * lookup falls back to the default rather than trusting it.
 */
export interface PreferencesSliceState {
  readonly boardStyle: string;
  readonly pieceSet: string;
  readonly movableHighlight: MovableHighlightName;
  readonly bikjangHint: BikjangHintName;
  readonly effects: EffectsName;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
  readonly sheetOpacity: Opacity;
}
