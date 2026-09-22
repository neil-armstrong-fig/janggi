import {expect, it} from "vitest";
import {hangulPieces} from "@src/react/pages/game/components/board/piece-styles/builtin/hangul/HangulPieces";
import {withPieceStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/WithPieceStyle";

it("changes what an army wears, and only that army", () => {
  const changedPieceSetStyle = withPieceStyle(hangulPieces, {kind: "side", side: "cho"}, pieceStyle => ({
    ...pieceStyle,
    size: 0.5,
  }));

  expect(changedPieceSetStyle.sides.cho.size).toBe(0.5);
  expect(changedPieceSetStyle.sides.han).toBe(hangulPieces.sides.han);
});

it("changes every piece of that army with a style of its own too — the general is part of the army", () => {
  const changedPieceSetStyle = withPieceStyle(hangulPieces, {kind: "side", side: "cho"}, pieceStyle => ({
    ...pieceStyle,
    size: 0.5,
  }));

  expect(changedPieceSetStyle.pieces?.["cho-general"]?.size).toBe(0.5);
  expect(changedPieceSetStyle.pieces?.["han-general"]).toBe(hangulPieces.pieces?.["han-general"]);
});

it("gives a piece a style of its own, made from what it wore, changing only what was asked", () => {
  const changedPieceSetStyle = withPieceStyle(
    hangulPieces,
    {kind: "piece", piece: {side: "cho", type: "chariot"}},
    pieceStyle => ({
      ...pieceStyle,
      size: 0.5,
    }),
  );

  expect(changedPieceSetStyle.pieces?.["cho-chariot"]).toEqual({...hangulPieces.sides.cho, size: 0.5});
  expect(changedPieceSetStyle.sides).toBe(hangulPieces.sides);
});

it("changes a piece that already has a style of its own from that, and leaves the others", () => {
  const changedPieceSetStyle = withPieceStyle(
    hangulPieces,
    {kind: "piece", piece: {side: "cho", type: "general"}},
    pieceStyle => ({
      ...pieceStyle,
      size: 0.5,
    }),
  );

  expect(changedPieceSetStyle.pieces?.["cho-general"]).toEqual({...hangulPieces.pieces?.["cho-general"], size: 0.5});
  expect(changedPieceSetStyle.pieces?.["han-general"]).toBe(hangulPieces.pieces?.["han-general"]);
});

it("adds no list of overrides to a set that had none", () => {
  const plain = {...hangulPieces, pieces: undefined};

  expect(withPieceStyle(plain, {kind: "side", side: "cho"}, pieceStyle => pieceStyle).pieces).toBeUndefined();
});
