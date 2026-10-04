import {FRIEND_CODE_ALPHABET, FRIEND_CODE_LENGTH} from "./FriendCode.js";
import type {FriendCode} from "./FriendCode.js";

/**
 * The code a player typed, or undefined where it is not one. Case, spaces and the hyphen `formatFriendCode` writes are
 * forgiven, because a code is retyped from a message; a character outside the alphabet is not, since guessing which
 * look-alike was meant could put a player in a stranger's room.
 */
export function parseFriendCode(text: string): FriendCode | undefined {
  const characters = text.toUpperCase().replace(/[\s-]/g, "");
  if (characters.length !== FRIEND_CODE_LENGTH) {
    return undefined;
  }

  if ([...characters].every(character => FRIEND_CODE_ALPHABET.includes(character))) {
    return characters as FriendCode;
  }

  return undefined;
}
