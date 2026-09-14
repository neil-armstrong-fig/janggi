import type {GameState} from "@src/game/types/GameState";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {shouldCallBikjang} from "@src/bot/choice/ShouldCallBikjang";

/**
 * Two generals down an open file 5, with a chariot each off to the side — 13 points a side, so under
 * the scored threshold — and one soldier more for whichever army should lead on points.
 */
function bikjang(format: MatchFormat, extra: readonly PlacedPiece[] = []): GameState {
  return {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, format),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "chariot"}, position: {file: 1, rank: 1}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 9, rank: 10}},
      ...extra,
    ],
  };
}

const twoChoSoldiers: readonly PlacedPiece[] = [
  {piece: {side: "cho", type: "soldier"}, position: {file: 1, rank: 7}},
  {piece: {side: "cho", type: "soldier"}, position: {file: 3, rank: 7}},
];

it("calls a casual bikjang when losing", () => {
  expect(shouldCallBikjang(bikjang("Casual"), -300)).toBe(true);
});

it("plays on in a casual bikjang when winning", () => {
  expect(shouldCallBikjang(bikjang("Casual"), 300)).toBe(false);
});

it("calls a scored bikjang when ahead on points", () => {
  expect(shouldCallBikjang(bikjang("Scored", twoChoSoldiers), 0)).toBe(true);
});

it("plays on in a scored bikjang when behind on points, Han's 덤 included", () => {
  expect(shouldCallBikjang(bikjang("Scored"), -900)).toBe(false);
});

it("calls nothing when there is no bikjang to call, however badly it is going", () => {
  const blocked = bikjang("Casual", [{piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 5}}]);

  expect(shouldCallBikjang(blocked, -900)).toBe(false);
});

it("calls nothing in a scored game above the threshold, where the rules offer no call", () => {
  const rich = {...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Scored")};
  const facing = {
    ...rich,
    pieces: rich.pieces.filter(({position}) => !(position.file === 5 && (position.rank === 4 || position.rank === 7))),
  };

  expect(shouldCallBikjang(facing, 0)).toBe(false);
});
