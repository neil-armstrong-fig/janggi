import type {Cue} from "@src/audio/types/Cue";
import type {CueName} from "@src/audio/types/CueName";
import {expect, it} from "vitest";
import {vibrationFor} from "@src/react/pages/game/hooks/use-haptics/utils/VibrationFor";

it("gives the lightest tap for a piece set down", () => {
  expect(vibrationFor(cues("piecePlaced"))).toEqual([8]);
});

it("gives a harder tap for a capture than for a move", () => {
  expect(total(vibrationFor(cues("pieceTaken")))).toBeGreaterThan(total(vibrationFor(cues("piecePlaced"))));
});

it("stutters for a check, and feels the check rather than the move that gave it", () => {
  const check = vibrationFor(cues("piecePlaced", "check"));

  expect(check?.length).toBeGreaterThan(1);
  expect(vibrationFor(cues("pieceTaken", "check"))).toEqual(check);
});

it("gives the longest pattern for the end of a game, however it ended", () => {
  const mate = vibrationFor(cues("piecePlaced", "checkmate"));

  expect(total(mate)).toBeGreaterThan(total(vibrationFor(cues("piecePlaced", "check"))));
  expect(vibrationFor(cues("turnRested", "pointsWin"))).toEqual(mate);
  expect(vibrationFor(cues("bikjang"))).toEqual(mate);
});

it("is not felt for a turn taken back, a rested turn or a new deal", () => {
  expect(vibrationFor(cues("turnTakenBack"))).toBeUndefined();
  expect(vibrationFor(cues("turnRested"))).toBeUndefined();
  expect(vibrationFor(cues("dealt"))).toBeUndefined();
});

function cues(...names: CueName[]): Cue[] {
  return names.map(name => ({name, weight: 1}));
}

function total(pattern: readonly number[] | undefined): number {
  return (pattern ?? []).reduce((sum, milliseconds) => sum + milliseconds, 0);
}
