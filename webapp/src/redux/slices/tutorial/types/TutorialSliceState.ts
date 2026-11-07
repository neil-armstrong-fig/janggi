import type {FriendRoomVisit} from "@src/redux/slices/online/connection/types/FriendRoomVisit";
import type {ParkedPlay} from "@src/redux/shared/parking/types/ParkedPlay";
import type {TutorialProgress} from "@src/redux/slices/tutorial/types/TutorialProgress";

/**
 * Whether the tutorial has the board, which is whether the player's own game is parked for it, and how far the player
 * has come through it. Only the progress is kept on the device: a reload puts the player's own game back (`Store.ts`
 * keeps the parked one while the tutorial is up), and Resume brings back the scene reached.
 */
export interface TutorialSliceState {
  readonly parked: ParkedPlay | undefined;
  /**
   * Which of the tutorial's scenes is on the board, counting from nought: the whole game first. One past the last scene
   * is the closing card, which stands over the last scene's board.
   */
  readonly scene: number;
  readonly progress: TutorialProgress;
  /**
   * A friend room the player was let into while the tutorial had the board — an invitation whose sign-in finished meanwhile
   * — held back until they leave it, since the room's game would otherwise be dealt over the tutorial's. Not kept.
   */
  readonly heldVisit: FriendRoomVisit | undefined;
}
