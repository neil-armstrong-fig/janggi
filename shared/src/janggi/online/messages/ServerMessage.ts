import type {Introduction} from "./Introduction.js";
import type {Look} from "./Look.js";
import type {RejectionReason} from "./RejectionReason.js";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {SeatedAction} from "@janggi/shared/janggi/online/messages/action/SeatedAction";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The host is seated and the room is waiting for the friend to come with the code. */
export interface WaitingMessage {
  readonly kind: "waiting";
}

/** Both are seated: which army this player has (drawn by the room), and who they are playing. */
export interface MatchedMessage {
  readonly kind: "matched";
  readonly side: Side;
  readonly opponent: Introduction;
}

/** Both have chosen, so both arrangements are shown at once and the game is dealt, Cho to move first as ever. */
export interface StartedMessage {
  readonly kind: "started";
  readonly hanSetup: SetupName;
  readonly choSetup: SetupName;
}

/** Something was done and the room accepted it — also echoed to whoever did it, which is when they see it happen. */
export interface ActedMessage {
  readonly kind: "acted";
  readonly by: Side;
  readonly action: RoomAction;
}

/** What a player who was away needs to be where the game is: the same things `matched` and `started` said, and what has been done since. */
export interface SnapshotMessage {
  readonly kind: "snapshot";
  readonly side: Side;
  readonly opponent: Introduction;
  readonly hanSetup?: SetupName;
  readonly choSetup?: SetupName;
  readonly history: readonly SeatedAction[];
}

/** The other player's socket closed. The room waits for them to come back for a while, then ends the game. */
export interface OpponentLeftMessage {
  readonly kind: "opponent-left";
}

/** The other player is back. */
export interface OpponentBackMessage {
  readonly kind: "opponent-back";
}

/** The other player changed their board or pieces; this is the look they wear now. */
export interface OpponentLookMessage {
  readonly kind: "opponent-look";
  readonly look: Look;
}

/** What was just sent was not accepted, and nothing changed. */
export interface RejectedMessage {
  readonly kind: "rejected";
  readonly reason: RejectionReason;
}

/** Everything the room may send a client over its socket. */
export type ServerMessage =
  | WaitingMessage
  | MatchedMessage
  | StartedMessage
  | ActedMessage
  | SnapshotMessage
  | OpponentLeftMessage
  | OpponentBackMessage
  | OpponentLookMessage
  | RejectedMessage;
