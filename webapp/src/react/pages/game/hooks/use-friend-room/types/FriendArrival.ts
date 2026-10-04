import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/** How a signed-in player arrives at a room as the page opens: by a link they were sent, or by the code the device kept. */
export type FriendArrival =
  {readonly kind: "link"; readonly code: FriendCode} | {readonly kind: "kept"; readonly code: string};
