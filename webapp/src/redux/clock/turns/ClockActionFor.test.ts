import {agreeADrawIn} from "@src/record/drawing/AgreeADrawIn";
import {changeBetween} from "@src/record/change/ChangeBetween";
import {clockActionFor} from "@src/redux/clock/turns/ClockActionFor";
import {clockDealt, clockStarted, turnCharged} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {playMove} from "@src/record/moving/PlayMove";
import {redo} from "@src/record/redo/Redo";
import {restTurn} from "@src/record/resting/RestTurn";
import {undo} from "@src/record/undo/Undo";
import type {ClockChange} from "@src/redux/clock/turns/types/ClockChange";
import type {PlayedGame} from "@src/record/types/PlayedGame";

const NOW = 5000;
const FRESH = firstGame().played;
const CHO_MOVED = playMove(FRESH, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});
const HAN_MOVED = playMove(CHO_MOVED, {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}});
const HAN_PASSED = restTurn(CHO_MOVED);

it("deals the time afresh on any deal, even with no clock in use", () => {
  expect(clockActionFor(step(CHO_MOVED, firstGame().played, {inUse: false}), NOW)).toEqual(clockDealt());
});

it("starts on the first turn, charging nobody", () => {
  expect(clockActionFor(step(FRESH, CHO_MOVED, {running: false}), NOW)).toEqual(clockStarted(NOW));
});

it("does not start where the first turn ended the game", () => {
  expect(clockActionFor(step(FRESH, agreeADrawIn(FRESH), {running: false}), NOW)).toBeUndefined();
});

it("charges a later turn to the army that took it, and runs on", () => {
  expect(clockActionFor(step(CHO_MOVED, HAN_MOVED), NOW)).toEqual(turnCharged({side: "han", at: NOW, runsOn: true}));
});

it("charges a pass as it does any other turn", () => {
  expect(clockActionFor(step(CHO_MOVED, HAN_PASSED), NOW)).toEqual(turnCharged({side: "han", at: NOW, runsOn: true}));
});

it("charges the last turn and stops where it ended the game", () => {
  const agreed = agreeADrawIn(CHO_MOVED);

  expect(clockActionFor(step(CHO_MOVED, agreed), NOW)).toEqual(turnCharged({side: "han", at: NOW, runsOn: false}));
});

it("does not start again on a later turn once the clock has stopped", () => {
  expect(clockActionFor(step(CHO_MOVED, HAN_MOVED, {running: false}), NOW)).toBeUndefined();
});

it("does nothing on a turn taken back or played again", () => {
  const takenBack = undo(HAN_MOVED);

  expect(clockActionFor(step(HAN_MOVED, takenBack), NOW)).toBeUndefined();
  expect(clockActionFor(step(takenBack, redo(takenBack)), NOW)).toBeUndefined();
});

it("does nothing where the game has no clock", () => {
  expect(clockActionFor(step(CHO_MOVED, HAN_MOVED, {inUse: false}), NOW)).toBeUndefined();
});

function step(before: PlayedGame, after: PlayedGame, stood: Partial<ClockChange> = {}): ClockChange {
  return {change: changeBetween(before, after), played: after, inUse: true, running: true, ...stood};
}
