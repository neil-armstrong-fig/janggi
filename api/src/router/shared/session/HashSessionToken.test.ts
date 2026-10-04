import {hashSessionToken} from "@src/router/shared/session/HashSessionToken";

it("hashes to the SHA-256 of the token, in hex", async () => {
  expect(await hashSessionToken("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

it("hashes different tokens differently", async () => {
  expect(await hashSessionToken("a")).not.toBe(await hashSessionToken("b"));
});
