import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {acceptedADraw} from "@src/redux/game/drawing/AcceptedADraw";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {outcomeOf} from "@src/game/OutcomeOf";
import {undo} from "@src/game/record/Undo";

it("draws the game the offer was made in", () => {
  expect(outcomeOf(acceptedADraw(offered()).played.present)).toEqual({kind: "agreement"});
});

it("is done with the offer", () => {
  expect(acceptedADraw(offered()).drawOffer).toBeUndefined();
});

it("records the agreement, so that it can be taken back like any ending", () => {
  const back = undo(acceptedADraw(offered()).played);

  expect(outcomeOf(back.present)).toEqual({kind: "undecided"});
});

it("refuses where nobody has offered a draw", () => {
  expect(() => acceptedADraw(firstGame())).toThrow(/no draw on offer/);
});

it("refuses an offer that has been declined", () => {
  const declined: GameSliceState = {...firstGame(), drawOffer: {by: "cho", declined: true}};

  expect(() => acceptedADraw(declined)).toThrow(/no draw on offer/);
});

function offered(): GameSliceState {
  return {...firstGame(), drawOffer: {by: "cho", declined: false}};
}
