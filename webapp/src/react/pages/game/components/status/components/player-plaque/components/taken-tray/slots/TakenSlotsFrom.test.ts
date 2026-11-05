import {expect, it} from "vitest";
import {takenSlotsFrom} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/slots/TakenSlotsFrom";

it("keeps a place for every kind an army can lose, most valuable first, before any are lost", () => {
  expect(takenSlotsFrom([])).toEqual([
    {type: "chariot", count: 0},
    {type: "cannon", count: 0},
    {type: "horse", count: 0},
    {type: "elephant", count: 0},
    {type: "guard", count: 0},
    {type: "soldier", count: 0},
  ]);
});

it("counts each kind in its own place, in whatever order they were lost", () => {
  const slots = takenSlotsFrom(["soldier", "guard", "soldier", "chariot", "soldier"]);

  expect(slots.map(({type, count}) => [type, count])).toEqual([
    ["chariot", 1],
    ["cannon", 0],
    ["horse", 0],
    ["elephant", 0],
    ["guard", 1],
    ["soldier", 3],
  ]);
});
