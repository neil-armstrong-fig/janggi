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

it("lays out a setup for the army it is asked to, carrying no evaluation into play", async () => {
  const engine = answering({bestMove: "a4a5", evaluation: 0});

  const han = await botReplyFor(engine, {
    duty: {kind: "layOut", side: "han", hanSetup: undefined},
    played: opening,
    elo: 1200,
    evaluation: 35,
    signal: live(),
  });
  const cho = await botReplyFor(engine, {
    duty: {kind: "layOut", side: "cho", hanSetup: DEFAULT_SETUP},
    played: opening,
    elo: 1200,
    evaluation: 35,
    signal: live(),
  });

  expect(hanSetupChosen.match(han.action)).toBe(true);
  expect(choSetupChosen.match(cho.action)).toBe(true);
  expect(han.evaluation).toBeUndefined();
});

it("plays the engine's move as the store's move, carrying its evaluation", async () => {
  const reply = await botReplyFor(answering({bestMove: "a4a5", evaluation: 20}), {
    duty: {kind: "play"},
    played: opening,
    elo: 1200,
    evaluation: undefined,
    signal: live(),
  });

  expect(reply).toEqual({action: moved(soldierForward), evaluation: 20});
});

it("rests the turn as the store's pass", async () => {
  const reply = await botReplyFor(answering({bestMove: "e2e2", evaluation: 0}), {
    duty: {kind: "play"},
    played: opening,
    elo: 1200,
    evaluation: undefined,
    signal: live(),
  });

  expect(reply.action).toEqual(passed());
});

it("carries the last evaluation on through a game under way", async () => {
  const reply = await botReplyFor(answering({bestMove: "", evaluation: undefined}), {
    duty: {kind: "play"},
    played: playMove(opening, soldierForward),
    elo: 1200,
    evaluation: 35,
    signal: live(),
  });

  expect(reply.evaluation).toBe(35);
});

it("forgets the last evaluation on a record with no turns in it", async () => {
  const reply = await botReplyFor(answering({bestMove: "", evaluation: undefined}), {
    duty: {kind: "play"},
    played: opening,
    elo: 1200,
    evaluation: 35,
    signal: live(),
  });

  expect(reply.evaluation).toBeUndefined();
});

function answering(result: SearchResult): Engine {
  return {prepare: () => Promise.resolve(), search: () => Promise.resolve(result), stop: () => undefined};
}

function live(): AbortSignal {
  return new AbortController().signal;
}
