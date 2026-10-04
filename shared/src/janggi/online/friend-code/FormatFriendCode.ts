import type {FriendCode} from "./FriendCode.js";

/** The code in two halves, `ABCD-EFGH`, which is easier to read out and to check by eye; `parseFriendCode` takes it back. */
export function formatFriendCode(code: FriendCode): string {
  const half = code.length / 2;

  return `${code.slice(0, half)}-${code.slice(half)}`;
}
