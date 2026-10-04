import {expect, it} from "vitest";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import type {Seat} from "@src/room/types/Seat";

const first: Seat = {accountId: "a", side: "cho", introduction: {displayName: "A"}};
const second: Seat = {accountId: "b", side: "han", introduction: {displayName: "B"}};

it("puts the replacement where the seat was, and leaves the others as they are", () => {
  const replacement = {...first, setup: "Inner Elephant"} as const;
  const seats = replaceSeat([first, second], first, replacement);

  expect(seats).toEqual([replacement, second]);
  expect(seats[1]).toBe(second);
});

it("changes nothing where the seat is not there", () => {
  expect(replaceSeat([first], second, first)).toEqual([first]);
});

it("finds the seat by identity, not by what it holds", () => {
  const lookalike = {...first};

  expect(replaceSeat([first], lookalike, second)).toEqual([first]);
});
