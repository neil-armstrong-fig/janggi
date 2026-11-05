import {clockPosed, clockReducer} from "@src/redux/clock/ClockSlice";
import {expect, it} from "vitest";
import {restarted} from "@src/redux/game/GameSlice";

it("stands the clocks back at the start when a new game is dealt", () => {
  const timeLost = clockReducer(undefined, clockPosed("Time lost"));

  expect(clockReducer(timeLost, restarted()).pose).toBe("Start");
});
