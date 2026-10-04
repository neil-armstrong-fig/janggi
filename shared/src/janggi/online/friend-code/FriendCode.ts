/**
 * What a friend code is made of: capitals and digits with the look-alikes taken out — no `0`/`O`, no `1`/`I`/`L` — because
 * a code is read aloud and typed in by hand, and a letter that may be a digit is a code that does not work. Thirty-one
 * characters over eight places is about 8.5 × 10¹¹ codes, far past what anybody could guess before a room expires.
 */
export const FRIEND_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const FRIEND_CODE_LENGTH = 8;

/**
 * A code that was checked: eight characters from `FRIEND_CODE_ALPHABET`. The brand is what makes `parseFriendCode` the way
 * in — a `string` from a text box is not one — so nothing downstream has to ask again.
 */
export type FriendCode = string & {readonly __friendCode: true};
