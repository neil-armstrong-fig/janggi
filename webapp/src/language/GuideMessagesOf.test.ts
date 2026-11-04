import {expect, it} from "vitest";
import {guideMessagesOf} from "@src/language/GuideMessagesOf";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";

it("says in Korean, and in English beside it, that the Korean guide was machine translated", () => {
  const notice = guideMessagesOf("ko").translationNotice;

  expect(notice?.statement).toContain("기계 번역");
  expect(notice?.statementInEnglish).toContain("machine translated");
});

it("does not say the original was translated", () => {
  expect(guideMessagesOf("en").translationNotice).toBeUndefined();
});

it("names, marks, describes and captions every kind of piece in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    for (const type of PIECE_TYPES) {
      const piece = guideMessagesOf(language).pieces.pieces[type];

      expect([piece.name, piece.mark, piece.description, piece.caption].every(words => words !== "")).toBe(true);
    }
  }
});

it("gives each piece the same mark in every language, since the marks are the Korean the board is drawn with", () => {
  for (const type of PIECE_TYPES) {
    expect(guideMessagesOf("ko").pieces.pieces[type].mark).toBe(guideMessagesOf("en").pieces.pieces[type].mark);
  }
});

it("states the four quick facts, the board, players, pieces and goal, in every language", () => {
  for (const language of LANGUAGE_NAMES) {
    expect(guideMessagesOf(language).hero.facts).toHaveLength(4);
  }
});

it("leaves English words out of what the Korean guide says of the rules, except the names it gives them", () => {
  const {rules} = guideMessagesOf("ko");

  expect(rules.passing.body).toContain("한수쉼");
  expect(rules.bikjang.body.marked).toBe("빅장");
});

it("names every language in itself on the switch, the same in each guide, so a reader can find theirs", () => {
  for (const language of LANGUAGE_NAMES) {
    expect(guideMessagesOf(language).header.languageNames).toEqual({en: "English", ko: "한국어"});
  }
});
