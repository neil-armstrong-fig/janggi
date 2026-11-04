import {expect, it} from "vitest";
import {addressOfReferences} from "@src/language/address/AddressOfReferences";

it("is the references at the root for English and in the Korean folder for Korean", () => {
  expect(addressOfReferences("en", "/")).toBe("/references.html");
  expect(addressOfReferences("ko", "/")).toBe("/ko/references.html");
});

it("keeps to where the app is served from", () => {
  expect(addressOfReferences("ko", "/janggi/")).toBe("/janggi/ko/references.html");
});
