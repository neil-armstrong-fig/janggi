import {HANGUL_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/marks/HangulCharacters";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import {PIECE_TYPES} from "@janggi/shared/janggi/pieces/PieceType";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import {characterFor} from "@src/react/pages/game/components/board/components/piece/utils/CharacterFor";
import {expect, it} from "vitest";

it("gives both armies the same character where a set names a piece only once", () => {
  expect(characterFor(HANJA_CHARACTERS, {side: "han", type: "horse"})).toBe("馬");
  expect(characterFor(HANJA_CHARACTERS, {side: "cho", type: "horse"})).toBe("馬");
});

it("gives each army its own character where a set names them separately", () => {
  expect(characterFor(HANJA_CHARACTERS, {side: "han", type: "general"})).toBe("漢");
  expect(characterFor(HANJA_CHARACTERS, {side: "cho", type: "general"})).toBe("楚");
});

it("names the generals after the rival states the game retells", () => {
  expect(characterFor(HANJA_CHARACTERS, {side: "han", type: "soldier"})).toBe("兵");
  expect(characterFor(HANJA_CHARACTERS, {side: "cho", type: "soldier"})).toBe("卒");
});

it("spells the same word in hangul rather than translating it", () => {
  expect(characterFor(HANGUL_CHARACTERS, {side: "han", type: "horse"})).toBe("마");
  expect(characterFor(HANGUL_CHARACTERS, {side: "cho", type: "elephant"})).toBe("상");
});

it("keeps the armies distinct in hangul wherever they are distinct in hanja", () => {
  expect(characterFor(HANGUL_CHARACTERS, {side: "han", type: "general"})).toBe("한");
  expect(characterFor(HANGUL_CHARACTERS, {side: "cho", type: "general"})).toBe("초");
  expect(characterFor(HANGUL_CHARACTERS, {side: "han", type: "soldier"})).toBe("병");
  expect(characterFor(HANGUL_CHARACTERS, {side: "cho", type: "soldier"})).toBe("졸");
});

it("has a character for every piece either army can hold, in both sets", () => {
  for (const characters of [HANJA_CHARACTERS, HANGUL_CHARACTERS]) {
    for (const type of PIECE_TYPES) {
      for (const side of SIDES) {
        expect(characterFor(characters, {side, type})).not.toBe("");
      }
    }
  }
});
