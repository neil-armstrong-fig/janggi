import type {ClockSliceState} from "@src/redux/clock/types/ClockSliceState";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";

/** The player's own game and its clock, set aside while the tutorial has the board. */
export interface ParkedPlay {
  readonly game: GameSliceState;
  /** Holding its turn (`heldMs`), so no time runs against the player while they are away from it. */
  readonly clock: ClockSliceState;
}
