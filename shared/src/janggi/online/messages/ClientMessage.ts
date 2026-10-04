import type {Introduction} from "./Introduction.js";
import type {Look} from "./Look.js";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";

/** Sitting down at the room: who this is, as far as the other player will be told. Sent first, once. */
export interface IntroduceMessage {
  readonly kind: "introduce";
  readonly introduction: Introduction;
}

/**
 * The arrangement this player chose for their army. Kept from the other until both have chosen, so neither answers the
 * other's — the room then deals the game with both.
 */
export interface ChooseSetupMessage {
  readonly kind: "choose-setup";
  readonly setup: SetupName;
}

/** Something done in the game. The room asks the engine whether it is legal and whose turn it is, and says so if not. */
export interface ActMessage {
  readonly kind: "act";
  readonly action: RoomAction;
}

/** The player changed their board or pieces: the look they now wear, which the room passes on to the other player at once. */
export interface UpdateLookMessage {
  readonly kind: "update-look";
  readonly look: Look;
}

/** Everything a client may send to the room over its socket. */
export type ClientMessage = IntroduceMessage | ChooseSetupMessage | ActMessage | UpdateLookMessage;
