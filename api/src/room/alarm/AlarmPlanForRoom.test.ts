import {NOW, seatedRoom, startedRoom} from "@src/room/testing/StartedRoom";
import {alarmPlanForRoom} from "@src/room/alarm/AlarmPlanForRoom";
import {expect, it} from "vitest";
import {newRoom} from "@src/room/opening/NewRoom";
import {roomTimingsFor} from "@src/room/alarm/RoomTimingsFor";

it("rings when a room nobody has joined is due to be let go", () => {
  expect(alarmPlanForRoom(newRoom("cho", NOW, 3), NOW)).toEqual({
    kind: "ring-at",
    at: NOW + roomTimingsFor(3).unjoined,
  });
});

it("does not ring for a game with both players in it", () => {
  expect(alarmPlanForRoom(startedRoom(), NOW)).toEqual({kind: "never"});
});

it("rings now for a room that is already due", () => {
  const stale = {...seatedRoom(), seats: seatedRoom().seats.slice(0, 1)};

  expect(alarmPlanForRoom(stale, NOW + roomTimingsFor(3).unjoined)).toEqual({
    kind: "ring-at",
    at: NOW + roomTimingsFor(3).unjoined,
  });
});
