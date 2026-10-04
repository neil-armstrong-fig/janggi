import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";

/** Which room, who to say this player is, and whether they have been in it before. */
export interface FriendRoomVisit {
  readonly code: string;
  readonly introduction: Introduction;
  /** Coming back to a room — after a reload, or a drop — rather than trying a code for the first time. A refused code ends a first try; a returner tries again. */
  readonly returning: boolean;
}
