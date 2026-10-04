import {ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import {expect, it} from "vitest";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";
import {staleRoomAfter} from "@src/room/alarm/StaleRoomAfter";

it("trusts a host's record for longer than any room, whichever choice is longest", () => {
  const longest = roomTimingsFor(Math.max(...ROOM_AWAY_DAYS) as (typeof ROOM_AWAY_DAYS)[number]);

  expect(staleRoomAfter()).toBeGreaterThan(longest.unjoined + longest.away + longest.finished);
});
