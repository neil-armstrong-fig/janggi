import type {Position} from "@src/game/board/types/Position";
import {checkLinesOf} from "@src/react/pages/game/components/board/components/check-lines/utils/CheckLinesOf";
import {expect, it} from "vitest";

const GENERAL: Position = {file: 5, rank: 9};
const CHARIOT: Position = {file: 5, rank: 1};
const HORSE: Position = {file: 4, rank: 7};

it("runs a line from the piece giving check to the general it attacks", () => {
  expect(checkLinesOf({general: GENERAL, attackers: [CHARIOT]})).toEqual([{from: CHARIOT, to: GENERAL}]);
});

it("runs one line from each attacker in a double check", () => {
  expect(checkLinesOf({general: GENERAL, attackers: [CHARIOT, HORSE]})).toEqual([
    {from: CHARIOT, to: GENERAL},
    {from: HORSE, to: GENERAL},
  ]);
});
