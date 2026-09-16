import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";

const board = {...classicStyle, name: "Shared board"};
const pieces = {...hangulPieces, name: "Shared pieces"};

it("imports a board style from a board key", () => {
  expect(styleImportFrom(encodeKey("board", board))).toEqual({kind: "board", style: board});
});

it("imports a piece set from a pieces key", () => {
  expect(styleImportFrom(encodeKey("pieces", pieces))).toEqual({kind: "pieces", style: pieces});
});

it("says what is wrong with a key whose style does not check out", () => {
  expect(styleImportFrom(encodeKey("board", {...board, surface: "url(https://example.com/a.png)"}))).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.surface"),
  });
});

it("refuses text that is neither kind of style key", () => {
  expect(styleImportFrom(encodeKey("save", {xp: 100}))).toEqual({
    kind: "refused",
    reason: "That is not a board or piece set key.",
  });
});
