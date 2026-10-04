import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/** What asking for a room came to: a new one, or the one the host still has open, as the real server's 201 and 409. */
export interface RoomOpened {
  readonly kind: "opened" | "already-open";
  readonly code: FriendCode;
}
