import {expect, it} from "vitest";
import {countdownOf} from "@src/react/pages/game/hooks/use-game-audio/utils/CountdownOf";

it("counts down to the flag while a clock is running", () => {
  expect(countdownOf({flagDueAt: 5_000, outOfTime: undefined, wanted: true})).toEqual({
    endsAt: 5_000,
    cue: "countdown",
  });
});

it("counts nothing while no clock is running", () => {
  expect(countdownOf({flagDueAt: undefined, outOfTime: undefined, wanted: true})).toBeUndefined();
});

it("counts nothing once a flag has fallen", () => {
  expect(countdownOf({flagDueAt: 5_000, outOfTime: "han", wanted: true})).toBeUndefined();
});

it("counts nothing for a player who has turned the countdown off", () => {
  expect(countdownOf({flagDueAt: 5_000, outOfTime: undefined, wanted: false})).toBeUndefined();
});
