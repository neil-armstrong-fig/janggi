import type {Engine} from "@src/bot/engine/types/Engine";
import type {GameState} from "@src/game/types/GameState";
import type {Search} from "@src/bot/engine/types/Search";
import type {SearchResult} from "@src/bot/engine/types/SearchResult";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {MOVE_TIMES_MS} from "@src/bot/levels/MoveTimes";
import {botTurnFor} from "@src/bot/BotTurnFor";
import {expect, it} from "vitest";
import {fenOf} from "@src/bot/notation/FenOf";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";

/** An engine that answers whatever it is told to, and remembers what it was asked. */
interface FakeEngine extends Engine {
  readonly asked: Search[];
}

function answering(result: SearchResult): FakeEngine {
  const asked: Search[] = [];

  return {
    asked,
    search: search => {
      asked.push(search);
      return Promise.resolve(result);
    },
    stop: () => undefined,
  };
}

const opening: GameState = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

it("plays the move the engine chooses", async () => {
  const engine = answering({bestMove: "a4a5", evaluation: 20});

  const decision = await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: undefined});

  expect(decision).toEqual({
    turn: {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}},
    evaluation: 20,
  });
});

it("rests the turn when the engine chooses to", async () => {
  const engine = answering({bestMove: "e2e2", evaluation: 0});

  expect((await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: undefined})).turn).toEqual({
    kind: "pass",
  });
});

it("restricts the engine to every legal move and the rested turn, and nothing else", async () => {
  const engine = answering({bestMove: "a4a5", evaluation: 0});

  await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: undefined});

  const searchMoves = engine.asked[0]?.searchMoves ?? [];
  expect(searchMoves).toHaveLength(32);
  expect(searchMoves).toContain("e2e2");
  expect(searchMoves).toContain("b1c3");
  expect(searchMoves).not.toContain("b3b10");
});

it("tells the engine how strong to play and how long it may think", async () => {
  const engine = answering({bestMove: "a4a5", evaluation: 0});

  await botTurnFor(engine, {played: playedGameFrom(opening), elo: 800, evaluation: undefined});

  expect(engine.asked[0]).toMatchObject({elo: 800, moveTimeMs: MOVE_TIMES_MS[800]});
});

it("shows the engine how the game got here", async () => {
  const engine = answering({bestMove: "c4c5", evaluation: 0});
  const played = playMove(playMove(playedGameFrom(opening), {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}), {
    from: {file: 1, rank: 4},
    to: {file: 1, rank: 5},
  });

  await botTurnFor(engine, {played, elo: 1200, evaluation: undefined});

  expect(engine.asked[0]).toMatchObject({fen: fenOf(opening), moves: ["a4a5", "a7a6"]});
});

it("plays something legal when the engine gives no move at all", async () => {
  const engine = answering({bestMove: "(none)", evaluation: undefined});

  const {turn} = await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: undefined});

  expect(turn.kind).toBe("move");
});

it("plays something legal when the engine names a move it was not offered", async () => {
  const engine = answering({bestMove: "b3b10", evaluation: undefined});

  const {turn} = await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: undefined});

  expect(turn).not.toEqual({kind: "move", move: {from: {file: 2, rank: 8}, to: {file: 2, rank: 1}}});
});

it("keeps the last evaluation it had when the engine reports none", async () => {
  const engine = answering({bestMove: "a4a5", evaluation: undefined});

  expect((await botTurnFor(engine, {played: playedGameFrom(opening), elo: 1200, evaluation: -40})).evaluation).toBe(
    -40,
  );
});

it("calls a casual bikjang it is losing without asking the engine anything", async () => {
  const engine = answering({bestMove: "e2e2", evaluation: 0});
  const bikjang: GameState = {
    ...opening,
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "han", type: "chariot"}, position: {file: 1, rank: 1}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    ],
  };

  const decision = await botTurnFor(engine, {played: playedGameFrom(bikjang), elo: 1200, evaluation: -800});

  expect(decision.turn).toEqual({kind: "callBikjang"});
  expect(engine.asked).toHaveLength(0);
});
