import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {expect, it} from "vitest";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

it("ships a piece set for every name @janggi/shared publishes, in the same order", () => {
  expect(BUILT_IN_PIECE_STYLES.map(set => set.name)).toEqual(PIECE_SET_NAMES);
});

/** As with the board styles: a set the editor starts from must be one the editor would let a player save. */
it("ships only sets that would pass the check an imported set must", () => {
  for (const set of BUILT_IN_PIECE_STYLES) {
    expect(pieceSetStyleFrom(set)).toEqual({kind: "accepted", value: set});
  }
});
