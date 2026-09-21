import type {BikjangHint} from "@src/react/pages/game/types/BikjangHint";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Effects} from "@src/react/pages/game/types/Effects";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * A player's preferences as the page draws and plays them: the store's names, each looked up.
 * `bikjangHint` is only what the player chose — see `BikjangHint` for what else decides it.
 *
 * The two styles are the plain style types rather than the built-ins', because either may be one of the
 * player's own.
 */
export interface Preferences {
  readonly boardStyle: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  readonly movableHighlight: MovableHighlight;
  readonly bikjangHint: BikjangHint;
  readonly effects: Effects;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
}
