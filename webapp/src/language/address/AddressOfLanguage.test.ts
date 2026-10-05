import {expect, it} from "vitest";
import {addressOfLanguage} from "@src/language/address/AddressOfLanguage";
import {languageOfAddress} from "@src/language/address/LanguageOfAddress";

it("is the root for English and a folder for Korean", () => {
  expect(addressOfLanguage("en", "/")).toBe("/");
  expect(addressOfLanguage("ko", "/")).toBe("/ko/");
});

it("keeps to where the app is served from", () => {
  expect(addressOfLanguage("ko", "/janggi/")).toBe("/janggi/ko/");
});

it("is read back as the same language", () => {
  expect(languageOfAddress(addressOfLanguage("ko", "/janggi/"), "/janggi/")).toBe("ko");
});
