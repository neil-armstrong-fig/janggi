import {GUEST, HOST, NOW, seatedRoom, startedRoom, withAway} from "@src/room/testing/StartedRoom";
import {expect, it} from "vitest";
import type {RoomState} from "@src/room/types/RoomState";
import {alarmDecisionFor} from "@src/room/alarm/AlarmDecisionFor";
import {newRoom} from "@src/room/opening/NewRoom";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";

const TIMINGS = roomTimingsFor(3);

it("keeps a room nobody joined until the friend has had a day, then deletes it", () => {
  const room = newRoom("cho", NOW, 3);

  expect(alarmDecisionFor(room, NOW + TIMINGS.unjoined - 1)).toEqual({kind: "keep", wakeAt: NOW + TIMINGS.unjoined});
  expect(alarmDecisionFor(room, NOW + TIMINGS.unjoined)).toEqual({kind: "delete"});
});

it("treats a room with only its host the same, however long it has been", () => {
  const hostOnly = {...newRoom("cho", NOW, 3), seats: seatedRoom().seats.slice(0, 1)};

  expect(alarmDecisionFor(hostOnly, NOW + TIMINGS.unjoined)).toEqual({kind: "delete"});
});

it("has nothing to wait for while both players are here", () => {
  expect(alarmDecisionFor(startedRoom(), NOW + 10 * TIMINGS.away)).toEqual({kind: "idle"});
});

it("never gives a game to the player who stayed, however long the other is away", () => {
  const room = withAway(startedRoom(), GUEST, NOW);

  expect(alarmDecisionFor(room, NOW + 100 * TIMINGS.away)).toEqual({kind: "idle"});
});

it("lets go of a game with both players gone once the later has been away as long as the host allowed", () => {
  const room = withAway(withAway(startedRoom(), HOST, NOW + 10), GUEST, NOW);

  expect(alarmDecisionFor(room, NOW + TIMINGS.away)).toEqual({kind: "keep", wakeAt: NOW + 10 + TIMINGS.away});
  expect(alarmDecisionFor(room, NOW + 10 + TIMINGS.away)).toEqual({kind: "delete"});
});

it("waits as long as the host chose", () => {
  const room = withAway(withAway({...startedRoom(), awayDays: 90}, HOST, NOW), GUEST, NOW);

  expect(alarmDecisionFor(room, NOW + TIMINGS.away)).toEqual({kind: "keep", wakeAt: NOW + roomTimingsFor(90).away});
});

it("lets go of a room whose players left before the game was dealt, on the same terms", () => {
  const room = withAway(withAway(seatedRoom(), HOST, NOW), GUEST, NOW);

  expect(alarmDecisionFor(room, NOW + TIMINGS.away)).toEqual({kind: "delete"});
});

it("keeps a finished room for a short grace, then deletes it", () => {
  const over: RoomState = {...startedRoom(), result: {kind: "resigned", winner: "cho"}, finishedAt: NOW};

  expect(alarmDecisionFor(over, NOW + TIMINGS.finished - 1)).toEqual({kind: "keep", wakeAt: NOW + TIMINGS.finished});
  expect(alarmDecisionFor(over, NOW + TIMINGS.finished)).toEqual({kind: "delete"});
});
