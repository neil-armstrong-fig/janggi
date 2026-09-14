import {bestMoveIn} from "@src/bot/engine/uci-lines/BestMoveIn";
import {expect, it} from "vitest";

it("reads the move off a bestmove line, leaving the ponder move behind", () => {
  expect(bestMoveIn("bestmove e2e2 ponder e9e9")).toBe("e2e2");
});

it("reads a bestmove line with nothing to ponder", () => {
  expect(bestMoveIn("bestmove b10c8")).toBe("b10c8");
});

it("reads the engine having no move as what it wrote", () => {
  expect(bestMoveIn("bestmove (none)")).toBe("(none)");
});

it("reads nothing off any other line", () => {
  expect(bestMoveIn("info depth 12 score cp 20 pv a4a5")).toBeUndefined();
  expect(bestMoveIn("readyok")).toBeUndefined();
});
