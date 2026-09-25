import type {Opponent} from "@src/redux/game/types/Opponent";
import {boardFlippedForHan} from "@src/react/pages/game/components/status/utils/BoardFlippedForHan";
import {expect, it} from "vitest";

it("flips the board on Han's move against a person, where it was asked for", () => {
  expect(boardFlippedForHan(true, opponent("Human"), "han")).toBe(true);
});

it("turns the board back on Cho's move", () => {
  expect(boardFlippedForHan(true, opponent("Human"), "cho")).toBe(false);
});

it("leaves the board as it is when the flip was not asked for", () => {
  expect(boardFlippedForHan(false, opponent("Human"), "han")).toBe(false);
});

it("never flips the board against the bot, whatever was asked for", () => {
  expect(boardFlippedForHan(true, opponent("Bot"), "han")).toBe(false);
});

function opponent(name: Opponent["name"]): Opponent {
  return {name, botElo: 1000, sideChoice: "Cho", playerSide: "cho"};
}
