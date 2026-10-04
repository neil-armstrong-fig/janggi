import {alarmPlanFor} from "@src/room/alarm/plan/AlarmPlanFor";
import {expect, it} from "vitest";

it("rings when the room next has something due", () => {
  expect(alarmPlanFor({kind: "keep", wakeAt: 500}, 100)).toEqual({kind: "ring-at", at: 500});
});

it("does not ring while somebody is in the room", () => {
  expect(alarmPlanFor({kind: "idle"}, 100)).toEqual({kind: "never"});
});

it("rings at once to have a room that is due let go", () => {
  expect(alarmPlanFor({kind: "delete"}, 100)).toEqual({kind: "ring-at", at: 100});
});
