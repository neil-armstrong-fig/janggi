import {expect, it} from "vitest";
import {formatFriendCode} from "@janggi/shared/janggi/online/friend-code/FormatFriendCode";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";

it("writes the code in two halves", () => {
  expect(formatFriendCode(parseFriendCode("ABCD2345")!)).toBe("ABCD-2345");
});

it("is read back by parseFriendCode", () => {
  const code = parseFriendCode("ABCD2345")!;

  expect(parseFriendCode(formatFriendCode(code))).toBe(code);
});
