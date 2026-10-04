import {expect, it} from "vitest";
import {parseFriendCode} from "./ParseFriendCode.js";

it("reads a code of eight characters from the alphabet", () => {
  expect(parseFriendCode("ABCD2345")).toBe("ABCD2345");
});

it("forgives case, spaces and the hyphen the code is shown with", () => {
  expect(parseFriendCode(" abcd-2345 \n")).toBe("ABCD2345");
});

it("is nothing for a code of the wrong length", () => {
  expect(parseFriendCode("ABCD234")).toBeUndefined();
  expect(parseFriendCode("ABCD23456")).toBeUndefined();
  expect(parseFriendCode("")).toBeUndefined();
});

it("is nothing for a look-alike the alphabet leaves out, rather than guessing which was meant", () => {
  for (const lookAlike of ["0", "O", "1", "I", "L"]) {
    expect(parseFriendCode(`ABCD234${lookAlike}`)).toBeUndefined();
  }
});

it("is nothing for characters that are not letters or digits", () => {
  expect(parseFriendCode("ABCD234!")).toBeUndefined();
  expect(parseFriendCode("ABCD234한")).toBeUndefined();
});
