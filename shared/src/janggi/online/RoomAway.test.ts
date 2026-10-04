import {DEFAULT_ROOM_AWAY_DAYS, ROOM_AWAY_DAYS} from "./RoomAway.js";
import {expect, it} from "vitest";

it("offers the default among its choices, and in order", () => {
  expect(ROOM_AWAY_DAYS).toContain(DEFAULT_ROOM_AWAY_DAYS);
  expect([...ROOM_AWAY_DAYS]).toEqual([...ROOM_AWAY_DAYS].sort((first, second) => first - second));
});
