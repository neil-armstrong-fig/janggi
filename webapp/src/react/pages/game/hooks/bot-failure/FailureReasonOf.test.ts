import {expect, it} from "vitest";
import {failureReasonOf} from "@src/react/pages/game/hooks/bot-failure/FailureReasonOf";

it("gives the message of an error", () => {
  expect(failureReasonOf(new Error("The engine did not start in time"))).toBe("The engine did not start in time");
});

it("gives whatever else was thrown as words", () => {
  expect(failureReasonOf("out of memory")).toBe("out of memory");
});
