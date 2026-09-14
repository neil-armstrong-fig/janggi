import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import {expect, it} from "vitest";
import {handsOpponentABikjang} from "@src/bot/choice/hands-opponent-a-bikjang/HandsOpponentABikjang";
import {newGame} from "@src/game/NewGame";

/**
 * Cho to move, its soldier the only thing standing between the two generals on file 5. Stepping it
 * aside opens the file; stepping it forward does not. A chariot each keeps both armies under 30.
 */
function screened(format: MatchFormat): GameState {
  return {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, format),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "chariot"}, position: {file: 1, rank: 1}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 9, rank: 10}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 6}},
    ],
  };
}

const ASIDE = {kind: "move", move: {from: {file: 5, rank: 6}, to: {file: 4, rank: 6}}} as const;
const FORWARD = {kind: "move", move: {from: {file: 5, rank: 6}, to: {file: 5, rank: 5}}} as const;

it("sees a winning bot opening the file as handing a casual opponent the draw", () => {
  expect(handsOpponentABikjang(screened("Casual"), ASIDE, 300)).toBe(true);
});

it("sees a losing bot opening the file as offering a draw nobody winning would take", () => {
  expect(handsOpponentABikjang(screened("Casual"), ASIDE, -300)).toBe(false);
});

it("sees nothing handed over by a move that keeps the file closed", () => {
  expect(handsOpponentABikjang(screened("Casual"), FORWARD, 300)).toBe(false);
});

it("sees a scored bot behind on points opening the file as handing the opponent the game", () => {
  // Cho's soldier alone would leave it half a point up on Han's 덤; a soldier for Han puts it behind.
  const behind: GameState = {
    ...screened("Scored"),
    pieces: [...screened("Scored").pieces, {piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 4}}],
  };

  expect(handsOpponentABikjang(behind, ASIDE, 900)).toBe(true);
});

it("sees a scored bot ahead on points opening the file as handing over nothing worth calling", () => {
  const ahead: GameState = {
    ...screened("Scored"),
    pieces: [
      ...screened("Scored").pieces,
      {piece: {side: "cho", type: "soldier"}, position: {file: 1, rank: 7}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 3, rank: 7}},
    ],
  };

  expect(handsOpponentABikjang(ahead, ASIDE, -900)).toBe(false);
});
