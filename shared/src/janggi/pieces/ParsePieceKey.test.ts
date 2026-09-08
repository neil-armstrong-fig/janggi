import {expect, it} from "vitest";
import {parsePieceKey} from "./ParsePieceKey.js";
import {toPieceKey} from "./ToPieceKey.js";

it("reads back the piece a key was built from", () => {
  expect(parsePieceKey("cho-elephant")).toEqual({side: "cho", type: "elephant"});
});

it("round-trips every piece either army can hold", () => {
  const pieces = [
    {side: "han", type: "general"},
    {side: "cho", type: "soldier"},
    {side: "han", type: "chariot"},
  ] as const;

  for (const piece of pieces) {
    expect(parsePieceKey(toPieceKey(piece))).toEqual(piece);
  }
});

it("finds nothing in a key naming an army that does not exist", () => {
  expect(parsePieceKey("wei-general")).toBeUndefined();
});

it("finds nothing in a key naming a piece that does not exist", () => {
  expect(parsePieceKey("han-bishop")).toBeUndefined();
});

it("finds nothing in a string that is not a key at all", () => {
  expect(parsePieceKey("")).toBeUndefined();
  expect(parsePieceKey("han")).toBeUndefined();
});
