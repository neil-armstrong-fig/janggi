import {expect, it} from "vitest";
import {ENGLISH} from "@src/language/english/English";
import {KOREAN} from "@src/language/korean/Korean";
import {unlockWordsOf} from "@src/react/pages/game/unlock-words/UnlockWordsOf";

it("names each kind of unlock in English", () => {
  const words = unlockWordsOf(
    [
      {kind: "pieces", name: "Hanja"},
      {kind: "board", name: "Neon"},
      {kind: "theme", name: "Diagram"},
      {kind: "style-editor"},
    ],
    ENGLISH.unlocks,
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
    KOREAN.unlocks,
  );

  expect(words).toBe("Hanja 말, Neon 판, Diagram 테마, 나만의 스타일 만들기");
});
