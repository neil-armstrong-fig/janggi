import {base64UrlOfBytes, bytesOfBase64Url} from "@src/push/encrypting/base64url/Base64Url";

it("writes bytes as unpadded base64url", () => {
  expect(base64UrlOfBytes(Uint8Array.of(251, 255, 254, 1))).toBe("-__-AQ");
});

it("reads unpadded base64url back into the bytes", () => {
  expect([...bytesOfBase64Url("-__-AQ")]).toEqual([251, 255, 254, 1]);
});
