import type {DealtFriendGame} from "@src/redux/online/types/DealtFriendGame";
import type {SetupPhase} from "@janggi/engine/setups/types/SetupPhase";
import {place} from "@janggi/engine/setups/Place";
import {setupPhaseFor} from "@janggi/engine/setups/SetupPhaseFor";

/** A friend game's phase: a casual game with both armies laid out as each player chose, since the room has dealt it. */
export function friendPhaseFor({hanSetup, choSetup}: Pick<DealtFriendGame, "hanSetup" | "choSetup">): SetupPhase {
  return place(place(setupPhaseFor("Casual"), "han", hanSetup), "cho", choSetup);
}
