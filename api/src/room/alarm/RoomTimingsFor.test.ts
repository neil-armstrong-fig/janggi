import {expect, it} from "vitest";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";

const DAY = 86_400_000;

it("lets both players be away for as many days as the host chose", () => {
  expect(roomTimingsFor(3).away).toBe(3 * DAY);
  expect(roomTimingsFor(30).away).toBe(30 * DAY);
});

it("gives a friend a day to come, and keeps a finished room two minutes, whatever was chosen", () => {
  expect(roomTimingsFor(1)).toMatchObject({unjoined: DAY, finished: 120_000});
  expect(roomTimingsFor(90)).toMatchObject({unjoined: DAY, finished: 120_000});
});
