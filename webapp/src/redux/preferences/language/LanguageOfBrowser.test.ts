import {expect, it} from "vitest";
import {languageOfBrowser} from "@src/redux/preferences/language/LanguageOfBrowser";

it("is Korean for a browser that prefers Korean", () => {
  expect(languageOfBrowser(["ko-KR", "en-US"])).toBe("ko");
});

it("reads the primary subtag, whatever its case or region", () => {
  expect(languageOfBrowser(["KO"])).toBe("ko");
  expect(languageOfBrowser(["en-GB"])).toBe("en");
});

it("takes the first of the preferred languages the game has", () => {
  expect(languageOfBrowser(["fr-FR", "ko", "en"])).toBe("ko");
});

it("is English for a browser that prefers none the game has, or says nothing", () => {
  expect(languageOfBrowser(["fr-FR", "de"])).toBe("en");
  expect(languageOfBrowser([])).toBe("en");
});
