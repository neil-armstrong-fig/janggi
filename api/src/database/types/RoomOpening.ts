/**
 * What came of recording a room: opened; or why not — the host already has one open (and its code, which is how a host who
 * lost theirs gets back to it), the code is in use, or there is no space.
 */
export type RoomOpening =
  | {readonly kind: "opened"}
  | {readonly kind: "already-open"; readonly code: string}
  | {readonly kind: "code-taken"}
  | {readonly kind: "full"};
