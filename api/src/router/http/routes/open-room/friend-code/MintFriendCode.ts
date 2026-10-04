import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {FRIEND_CODE_ALPHABET, FRIEND_CODE_LENGTH} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

/** The largest multiple of the alphabet's length that fits in a byte: a byte at or past it is dropped, so no letter is likelier than another. */
const USABLE_BYTES = 256 - (256 % FRIEND_CODE_ALPHABET.length);

/**
 * A new friend code from `randomBytes` (the platform's random source, handed in so a test controls it). The code is
 * the only secret a room has, so it comes from `crypto`, never `Math.random`.
 */
export function mintFriendCode(randomBytes: (length: number) => Uint8Array): FriendCode {
  let code = "";

  while (code.length < FRIEND_CODE_LENGTH) {
    for (const byte of randomBytes(FRIEND_CODE_LENGTH * 2)) {
      if (byte < USABLE_BYTES && code.length < FRIEND_CODE_LENGTH) {
        code += FRIEND_CODE_ALPHABET[byte % FRIEND_CODE_ALPHABET.length];
      }
    }
  }

  return parseFriendCode(code) as FriendCode;
}
