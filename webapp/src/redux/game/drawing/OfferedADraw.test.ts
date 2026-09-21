import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";
import {offeredADraw} from "@src/redux/game/drawing/OfferedADraw";

it("puts the offer to the other army, in the name of the army to move", () => {
  expect(offeredADraw(casual()).drawOffer).toEqual({by: "cho", declined: false});
});

it("leaves the record exactly as it was, an offer being a question and not a turn", () => {
  const state = casual();

  expect(offeredADraw(state).played).toBe(state.played);
});

it("refuses in a scored game, which has no draw to offer", () => {
  const scored: GameSliceState = {...firstGame(), ...dealtGame(freshPhaseFor("Scored"))};

  expect(() => offeredADraw(scored)).toThrow(/casual game/);
});

function casual(): GameSliceState {
  return firstGame();
}
