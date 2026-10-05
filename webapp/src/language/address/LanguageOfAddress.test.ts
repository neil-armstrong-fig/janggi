import {expect, it} from "vitest";
import {languageOfAddress} from "@src/language/address/LanguageOfAddress";

it("is Korean under /ko/, with or without the slash or a page after it", () => {
  expect(languageOfAddress("/ko/", "/")).toBe("ko");
  expect(languageOfAddress("/ko", "/")).toBe("ko");
  expect(languageOfAddress("/ko/index.html", "/")).toBe("ko");
});

it("says nothing at the root, where the player's own choice stands", () => {
  expect(languageOfAddress("/", "/")).toBeUndefined();
  expect(languageOfAddress("/index.html", "/")).toBeUndefined();
});

it("does not take a page that only starts with the same letters for the Korean folder", () => {
  expect(languageOfAddress("/korean.html", "/")).toBeUndefined();
});

it("reads the folder from where the app is served", () => {
  expect(languageOfAddress("/janggi/ko/", "/janggi/")).toBe("ko");
  expect(languageOfAddress("/ko/", "/janggi/")).toBeUndefined();
});
