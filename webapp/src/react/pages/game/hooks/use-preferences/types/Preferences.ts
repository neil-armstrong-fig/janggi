import type {ArmyBoardStyles} from "@src/styles/board-halves/types/ArmyBoardStyles";
import type {ArmyPieceSets} from "@src/styles/piece-sets/types/ArmyPieceSets";
import type {BikjangHint} from "@src/react/pages/game/types/BikjangHint";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Effects} from "@src/react/pages/game/types/Effects";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import type {Opacity} from "@janggi/shared/janggi/settings/Opacity";
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
  /** The one board the game is drawn on: each army's own half, put together. */
  readonly boardStyle: BoardStyle;
  /** The board each army wears, which the settings show. */
  readonly armyBoardStyles: ArmyBoardStyles;
  /** The one set the board is drawn with: each army's own, put together. */
  readonly pieceStyle: PieceSetStyle;
  /** The set each army wears, which the settings show. */
  readonly armyPieceSets: ArmyPieceSets;
  readonly movableHighlight: MovableHighlight;
  readonly bikjangHint: BikjangHint;
  readonly effects: Effects;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
  readonly sheetOpacity: Opacity;
}
