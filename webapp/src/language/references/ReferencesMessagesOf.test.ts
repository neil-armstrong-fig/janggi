import {expect, it} from "vitest";
import {referencesMessagesOf} from "@src/language/references/ReferencesMessagesOf";

it("says in Korean, and in English beside it, that the Korean references were machine translated", () => {
  const notice = referencesMessagesOf("ko").translationNotice;

  expect(notice?.statement).toContain("기계 번역");
  expect(notice?.statementInEnglish).toContain("machine translated");
});

it("does not say the original was translated", () => {
  expect(referencesMessagesOf("en").translationNotice).toBeUndefined();
});

it("words a licence in each language, keeping its name", () => {
  expect(referencesMessagesOf("en").licenceOf("GPL-3.0")).toBe("GPL-3.0 licence");
  expect(referencesMessagesOf("ko").licenceOf("GPL-3.0")).toBe("GPL-3.0 라이선스");
});
