import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** One player's place in a room: the account that sat down, the army they have, and what they have said and chosen. */
export interface Seat {
  readonly accountId: string;
  readonly side: Side;
  readonly introduction: Introduction;
  readonly setup?: SetupName;
  /** When this player's socket closed, in milliseconds; absent while they are connected. */
  readonly goneSince?: number;
}
