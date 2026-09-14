import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import type {Effects} from "@src/react/pages/game/types/Effects";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * A player's preferences as the page draws and plays them: the store's names, each looked up.
 *
 * The two styles are the built-in types, because a name the store holds can only name a built-in —
 * and that keeps the name narrow for a picker handing a choice back to the store.
 */
export interface Preferences {
  readonly boardStyle: BuiltInBoardStyle;
  readonly pieceStyle: BuiltInPieceSetStyle;
  readonly movableHighlight: MovableHighlight;
  readonly effects: Effects;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
}
