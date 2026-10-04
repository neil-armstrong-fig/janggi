import {expect, it} from "vitest";
import {friendCodeInSearch, joinLinkFor} from "./JoinLink.js";
import {parseFriendCode} from "./ParseFriendCode.js";

const code = parseFriendCode("ABCD2345")!;

it("puts the code in the join parameter of the site's address", () => {
  expect(joinLinkFor("https://janggi.neilarmstrong.dev/", code)).toBe(
    "https://janggi.neilarmstrong.dev/?join=ABCD2345",
  );
});

it("drops whatever query or fragment the page had", () => {
  expect(joinLinkFor("https://janggi.neilarmstrong.dev/?account=1#top", code)).toBe(
    "https://janggi.neilarmstrong.dev/?join=ABCD2345",
  );
});

it("reads the code back out of a location's search", () => {
  expect(friendCodeInSearch(new URL(joinLinkFor("https://example.test/", code)).search)).toBe(code);
});

it("is nothing where the page carries no code, or a bad one", () => {
  expect(friendCodeInSearch("")).toBeUndefined();
  expect(friendCodeInSearch("?account=1")).toBeUndefined();
  expect(friendCodeInSearch("?join=nope")).toBeUndefined();
});
