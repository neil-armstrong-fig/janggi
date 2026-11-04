import {expect, it} from "vitest";
import {addressOfGuide} from "@src/language/address/AddressOfGuide";

it("is the guide at the root for English and in the Korean folder for Korean", () => {
  expect(addressOfGuide("en", "/")).toBe("/learn.html");
  expect(addressOfGuide("ko", "/")).toBe("/ko/learn.html");
});

it("keeps to where the app is served from", () => {
  expect(addressOfGuide("ko", "/janggi/")).toBe("/janggi/ko/learn.html");
});
