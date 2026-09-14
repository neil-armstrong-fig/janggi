import type {Engine} from "@src/bot/engine/types/Engine";
import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {botReplyFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/BotReplyFor";
import {choSetupChosen, hanSetupChosen, moved, passed} from "@src/redux/game/GameSlice";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

const opening: PlayedGame = playedGameFrom(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"));

const soldierForward: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

it("lays out a setup for the army it is asked to, without asking the engine", async () => {
  const han = await botReplyFor({kind: "layOut", side: "han"}, unasked(), opening, 1200, 35);
  const cho = await botReplyFor({kind: "layOut", side: "cho"}, unasked(), opening, 1200, 35);

  expect(hanSetupChosen.match(han.action)).toBe(true);
  expect(choSetupChosen.match(cho.action)).toBe(true);
  expect(han.evaluation).toBeUndefined();
});

it("plays the engine's move as the store's move, carrying its evaluation", async () => {
  const reply = await botReplyFor(
    {kind: "play"},
    answering({bestMove: "a4a5", evaluation: 20}),
    opening,
    1200,
    undefined,
  );

  expect(reply).toEqual({action: moved(soldierForward), evaluation: 20});
});

it("rests the turn as the store's pass", async () => {
  const reply = await botReplyFor(
    {kind: "play"},
    answering({bestMove: "e2e2", evaluation: 0}),
    opening,
    1200,
    undefined,
  );

  expect(reply.action).toEqual(passed());
});

it("carries the last evaluation on through a game under way", async () => {
  const underWay = playMove(opening, soldierForward);

  const reply = await botReplyFor({kind: "play"}, answering({bestMove: "", evaluation: undefined}), underWay, 1200, 35);

  expect(reply.evaluation).toBe(35);
});

it("forgets the last evaluation on a record with no turns in it", async () => {
  const reply = await botReplyFor({kind: "play"}, answering({bestMove: "", evaluation: undefined}), opening, 1200, 35);

  expect(reply.evaluation).toBeUndefined();
});

function answering(result: SearchResult): Engine {
  return {search: () => Promise.resolve(result), stop: () => undefined};
}

function unasked(): Engine {
  return {search: () => Promise.reject(new Error("Laying out asks the engine nothing")), stop: () => undefined};
}
