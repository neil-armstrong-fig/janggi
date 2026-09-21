import type {GameState} from "@src/game/types/GameState";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {RecordChange} from "@src/game/record/types/RecordChange";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {ratingEventFor} from "@src/react/pages/game/hooks/use-rated-game/utils/RatingEventFor";
import {restTurn} from "@src/game/record/RestTurn";
import {stoodBefore} from "@src/testing/StoodBefore";

const bot: Opponent = {name: "Bot", botElo: 1400, sideChoice: "Han", playerSide: "han"};
const human: Opponent = {name: "Human", botElo: 1400, sideChoice: "Cho", playerSide: "cho"};

const opening: GameState = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Scored");
const firstTurn: PlayedGame = playMove(playedGameFrom(opening), {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});
const secondTurn: PlayedGame = playMove(firstTurn, {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}});

const ADVANCED: RecordChange = {direction: "advanced", transition: undefined};
const DEALT: RecordChange = {direction: "dealt", transition: undefined};

/**
 * Cho's general on its back edge, mated by two han chariots: one checks it up file 5, the other runs
 * along rank 10 and covers both points it could step aside to.
 */
const choMated: GameState = {
  ...opening,
  pieces: [
    {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
    {piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 7}},
    {piece: {side: "han", type: "chariot"}, position: {file: 1, rank: 10}},
    {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 10}},
  ],
};

it("starts rating a game against the bot on its first turn, whoever took it", () => {
  expect(ratingEventFor({change: ADVANCED, played: firstTurn, opponent: bot, inProgress: false})).toEqual({
    kind: "started",
    format: "Scored",
    botElo: 1400,
    playerSide: "han",
  });
});

it("says nothing about a turn once the game is already under way", () => {
  expect(ratingEventFor({change: ADVANCED, played: secondTurn, opponent: bot, inProgress: true})).toBeUndefined();
});

it("rates nothing played between two people at one device", () => {
  expect(ratingEventFor({change: ADVANCED, played: firstTurn, opponent: human, inProgress: false})).toBeUndefined();
});

it("abandons the game in progress when a new one is dealt over it", () => {
  const played = playedGameFrom(opening);

  expect(ratingEventFor({change: DEALT, played, opponent: bot, inProgress: true})).toEqual({kind: "abandoned"});
});

it("abandons nothing when a game is dealt with none in progress", () => {
  const played = playedGameFrom(opening);

  expect(ratingEventFor({change: DEALT, played, opponent: bot, inProgress: false})).toBeUndefined();
});

it("finishes a game the player wins by checkmate", () => {
  const played: PlayedGame = {past: [opening, opening], present: choMated, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: true})).toEqual({
    kind: "finished",
    result: "won",
    ending: "checkmate",
  });
});

it("finishes a game the player loses by checkmate", () => {
  const played: PlayedGame = {past: [opening, opening], present: choMated, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: {...bot, playerSide: "cho"}, inProgress: true})).toEqual({
    kind: "finished",
    result: "lost",
    ending: "checkmate",
  });
});

it("finishes a game settled on points by two rested turns", () => {
  const played = restTurn(restTurn(secondTurn));

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: true})).toEqual({
    kind: "finished",
    result: "won",
    ending: "points",
  });
});

it("finishes a casual game drawn by a called bikjang as a draw", () => {
  const facing: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    ],
    bikjangCalled: true,
  };
  const played: PlayedGame = {past: [facing, facing], present: facing, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: true})).toEqual({
    kind: "finished",
    result: "drawn",
    ending: "bikjang",
  });
});

it("finishes a casual game drawn by agreement as a draw", () => {
  const agreed: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    drawAgreed: true,
  };
  const played: PlayedGame = {past: [agreed, agreed], present: agreed, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: true})).toEqual({
    kind: "finished",
    result: "drawn",
    ending: "agreement",
  });
});

it("finishes a casual game stopped by a repetition as a draw", () => {
  const bare: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 2}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    ],
  };
  const repeated = stoodBefore(bare, 2);
  const played: PlayedGame = {past: [bare, bare], present: repeated, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: true})).toEqual({
    kind: "finished",
    result: "drawn",
    ending: "repetition",
  });
});

it("finishes nothing that was never started", () => {
  const played: PlayedGame = {past: [opening, opening], present: choMated, future: []};

  expect(ratingEventFor({change: ADVANCED, played, opponent: bot, inProgress: false})).toBeUndefined();
});

it("reads nothing into a turn taken back or played again", () => {
  const takenBack: RecordChange = {direction: "takenBack", transition: undefined};
  const replayed: RecordChange = {direction: "replayed", transition: undefined};

  expect(ratingEventFor({change: takenBack, played: firstTurn, opponent: bot, inProgress: true})).toBeUndefined();
  expect(ratingEventFor({change: replayed, played: firstTurn, opponent: bot, inProgress: true})).toBeUndefined();
});
