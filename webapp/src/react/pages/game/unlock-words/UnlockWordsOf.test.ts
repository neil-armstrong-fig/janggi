import {expect, it} from "vitest";
import {ENGLISH_MESSAGES} from "@src/language/messages/english/EnglishMessages";
import {KOREAN_MESSAGES} from "@src/language/messages/korean/KoreanMessages";
import {unlockWordsOf} from "@src/react/pages/game/unlock-words/UnlockWordsOf";

it("names each kind of unlock in English", () => {
  const words = unlockWordsOf(
    [
      {kind: "pieces", name: "Hanja"},
      {kind: "board", name: "Neon"},
      {kind: "theme", name: "Diagram"},
      {kind: "style-editor"},
    ],
    ENGLISH_MESSAGES.unlocks,
  );

  expect(words).toBe("Hanja pieces, Neon board, Diagram theme, Creating your own styles");
});

it("keeps a style's own name in Korean and translates the words around it", () => {
  const words = unlockWordsOf(
    [
      {kind: "pieces", name: "Hanja"},
      {kind: "board", name: "Neon"},
      {kind: "theme", name: "Diagram"},
      {kind: "style-editor"},
    ],
    KOREAN_MESSAGES.unlocks,
  );

  expect(words).toBe("Hanja 말, Neon 판, Diagram 테마, 나만의 스타일 만들기");
});
