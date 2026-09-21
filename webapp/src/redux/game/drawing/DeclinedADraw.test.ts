import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {declinedADraw} from "@src/redux/game/drawing/DeclinedADraw";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";

it("keeps the refusal, so that whoever offered can be told", () => {
  expect(declinedADraw(offered()).drawOffer).toEqual({by: "cho", declined: true});
});

it("leaves the game as it was where no draw is on offer", () => {
  const state = firstGame();

  expect(declinedADraw(state)).toBe(state);
});

it("leaves it as it was where the offer was declined already", () => {
  const state = declinedADraw(offered());

  expect(declinedADraw(state)).toBe(state);
});

function offered(): GameSliceState {
  return {...firstGame(), drawOffer: {by: "cho", declined: false}};
}
