import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";

/**
 * What a save key carries from one device to another: the player's progress and their own styles.
 *
 * Not the record against the bot, which would make the key many times longer for something a player
 * moving device can live without, and not the game on the board.
 */
export interface Save {
  readonly progress: ProgressSliceState;
  readonly customStyles: CustomStylesSliceState;
}
