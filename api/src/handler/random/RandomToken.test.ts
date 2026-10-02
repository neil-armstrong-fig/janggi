import {vi} from "vitest";
import {randomToken} from "@src/handler/random/RandomToken";

it("is 256 bits, written in the characters of base64url", () => {
  expect(randomToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

it("is never the same twice", () => {
  expect(randomToken()).not.toBe(randomToken());
});

it("never writes the characters of plain base64 that a cookie or a URL would need escaping", () => {
  vi.spyOn(crypto, "getRandomValues").mockImplementation(((array: Uint8Array) => array.fill(0xfb)) as never);

  expect(randomToken()).not.toMatch(/[+/=]/);
});
