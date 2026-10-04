import type {Setup} from "@janggi/engine/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What the room dealt: both arrangements, and which army is this player's. Dealt as a casual game between two people. */
export interface DealtFriendGame {
  readonly hanSetup: Setup;
  readonly choSetup: Setup;
  readonly ownSide: Side;
}
