import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {wouldCallBikjang} from "@src/bot/choice/would-call-bikjang/WouldCallBikjang";

const casual: GameState = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

/** Cho a cannon short — 65 against Han's 73.5 — so Han leads on points and Cho trails. */
const scoredWithChoBehind: GameState = {
  ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Scored"),
  pieces: newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Scored").pieces.filter(
    ({piece, position}) => !(piece.side === "cho" && piece.type === "cannon" && position.file === 2),
  ),
};

it("takes a casual draw when the evaluation says it is losing", () => {
  expect(wouldCallBikjang(casual, "cho", -300)).toBe(true);
});

it("refuses a casual draw when the evaluation says it is winning", () => {
  expect(wouldCallBikjang(casual, "cho", 300)).toBe(false);
});

it("refuses a casual draw in a level position, where there is still a game to play", () => {
  expect(wouldCallBikjang(casual, "cho", 0)).toBe(false);
});

it("refuses a casual draw when there is no evaluation to go on", () => {
  expect(wouldCallBikjang(casual, "cho", undefined)).toBe(false);
});

it("calls a scored bikjang when ahead on points, whatever the evaluation", () => {
  expect(wouldCallBikjang(scoredWithChoBehind, "han", -900)).toBe(true);
});

it("refuses a scored bikjang when behind on points, whatever the evaluation", () => {
  expect(wouldCallBikjang(scoredWithChoBehind, "cho", 900)).toBe(false);
});
