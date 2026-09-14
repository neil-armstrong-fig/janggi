import {evaluationIn} from "@src/bot/engine/uci-lines/EvaluationIn";
import {expect, it} from "vitest";

it("reads the score in centipawns off an info line", () => {
  expect(evaluationIn("info depth 12 seldepth 15 multipv 1 score cp -47 nodes 79002 pv a4a5 b10c8")).toBe(-47);
});

it("reads a mate the engine can force as a score no material count reaches", () => {
  expect(evaluationIn("info depth 20 score mate 3 nodes 1200 pv a1a9")).toBeGreaterThanOrEqual(10_000);
});

it("reads a mate against the side to move as the same score turned round", () => {
  expect(evaluationIn("info depth 20 score mate -2 nodes 1200 pv a1a9")).toBeLessThanOrEqual(-10_000);
});

it("reads nothing off an info line with no score in it", () => {
  expect(evaluationIn("info string variant janggibot files 9 ranks 10")).toBeUndefined();
});

it("reads nothing off a line that is not info at all", () => {
  expect(evaluationIn("bestmove a4a5 ponder b10c8")).toBeUndefined();
});
