import type {GameState} from "@src/game/types/GameState";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {fenOf} from "@src/bot/notation/FenOf";
import {historyFor} from "@src/bot/notation/HistoryFor";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {restTurn} from "@src/game/record/RestTurn";

const opening: GameState = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

it("starts a game nobody has played from the position on the board, with nothing after it", () => {
  expect(historyFor(playedGameFrom(opening))).toEqual({fen: fenOf(opening), moves: []});
});

it("keeps the opening position and lists each move played since it", () => {
  let played: PlayedGame = playedGameFrom(opening);
  played = playMove(played, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});
  played = playMove(played, {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}});

  expect(historyFor(played)).toEqual({fen: fenOf(opening), moves: ["a4a5", "a7a6"]});
});

it("lists a rested turn as the general standing still", () => {
  const played = restTurn(playMove(playedGameFrom(opening), {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));

  expect(historyFor(played).moves).toEqual(["a4a5", "e9e9"]);
});

it("starts again from the position a capture left, since nothing before it can come round again", () => {
  const facing: GameState = {
    ...opening,
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 5}},
      {piece: {side: "han", type: "soldier"}, position: {file: 9, rank: 4}},
      {piece: {side: "cho", type: "general"}, position: {file: 6, rank: 9}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 1, rank: 6}},
    ],
  };

  const captured = playMove(playedGameFrom(facing), {from: {file: 1, rank: 6}, to: {file: 1, rank: 5}});
  const played = playMove(captured, {from: {file: 9, rank: 4}, to: {file: 9, rank: 5}});

  expect(historyFor(played)).toEqual({fen: fenOf(captured.present), moves: ["i7i6"]});
});
