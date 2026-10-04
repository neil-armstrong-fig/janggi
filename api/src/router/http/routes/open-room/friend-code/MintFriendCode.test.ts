import {expect, it} from "vitest";
import {FRIEND_CODE_ALPHABET} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {mintFriendCode} from "@src/router/http/routes/open-room/friend-code/MintFriendCode";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

it("spells a code from the bytes, one letter of the alphabet to a byte", () => {
  const bytes = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0]);

  expect(mintFriendCode(() => bytes)).toBe("23456789");
});

it("drops the bytes that would make some letters likelier than others", () => {
  const first = Uint8Array.from([255, 250, 248, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  expect(mintFriendCode(() => first)).toBe("23456789");
});

it("asks again when the bytes it was given did not make a whole code", () => {
  const unusable = new Uint8Array(16).fill(255);
  const usable = Uint8Array.from({length: 16}, (_, index) => index);
  const draws = [unusable, usable];

  expect(mintFriendCode(() => draws.shift() as Uint8Array)).toBe("23456789");
});

it("always makes a code the parser accepts", () => {
  const code = mintFriendCode(length => crypto.getRandomValues(new Uint8Array(length)));

  expect(parseFriendCode(code)).toBe(code);
  expect([...code].every(character => FRIEND_CODE_ALPHABET.includes(character))).toBe(true);
});
