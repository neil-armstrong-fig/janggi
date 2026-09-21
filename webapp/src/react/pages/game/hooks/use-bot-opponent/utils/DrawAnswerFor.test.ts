import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {drawAccepted, drawDeclined} from "@src/redux/game/GameSlice";
import {drawAnswerFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/DrawAnswerFor";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

const endgame: GameState = {
  ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
  pieces: [
    {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    {piece: {side: "han", type: "general"}, position: {file: 4, rank: 2}},
  ],
};

it("accepts as the store's accepted draw when the bot would take it", () => {
  expect(drawAccepted.match(drawAnswerFor(endgame, 0))).toBe(true);
});

it("declines as the store's declined draw when the bot would not", () => {
  expect(drawDeclined.match(drawAnswerFor(endgame, 400))).toBe(true);
});

it("declines a draw offered from the opening, which is not one a bot takes", () => {
  expect(drawDeclined.match(drawAnswerFor(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), -400))).toBe(true);
});
