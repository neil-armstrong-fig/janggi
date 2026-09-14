import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {botStrengthChosen, gameReducer, moved, opponentChosen, passed} from "@src/redux/game/GameSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {ratedGameStarted, ratingsReducer} from "@src/redux/ratings/RatingsSlice";
import {restoredRatings} from "@src/redux/restored-ratings/RestoredRatings";

const NOW = "2026-09-15T08:00:00.000Z";

const inProgress: RatingsSliceState = ratingsReducer(
  freshRatings(),
  ratedGameStarted({format: "Casual", botElo: 800, playerSide: "cho", startedAt: "2026-09-14T22:00:00.000Z"}),
);

/** The game that rating is for: casual, against the 800 bot, the player on cho, one move in. */
const thatGame: GameSliceState = [
  opponentChosen("Bot"),
  botStrengthChosen(800),
  moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}),
].reduce(gameReducer, firstGame());

it("keeps the game in progress when the game come back to is that game, still being played", () => {
  expect(restoredRatings(inProgress, thatGame, NOW)).toEqual(inProgress);
});

it("rates the game as abandoned when the game come back to has not begun, even against that same bot", () => {
  const notBegun = [opponentChosen("Bot"), botStrengthChosen(800)].reduce(gameReducer, firstGame());

  const restored = restoredRatings(inProgress, notBegun, NOW);

  expect(restored.inProgress).toBeUndefined();
  expect(restored.byFormat.Casual.games[0]).toMatchObject({result: "lost", ending: "abandoned", finishedAt: NOW});
});

it("rates the game as abandoned when the game come back to is against another strength of bot", () => {
  const stronger = [
    opponentChosen("Bot"),
    botStrengthChosen(1600),
    moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}),
  ].reduce(gameReducer, firstGame());

  expect(restoredRatings(inProgress, stronger, NOW).inProgress).toBeUndefined();
});

it("rates the game as abandoned when the game come back to is against a person", () => {
  const human = gameReducer(firstGame(), moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));

  expect(restoredRatings(inProgress, human, NOW).inProgress).toBeUndefined();
});

it("rates the game as abandoned when the game come back to is already decided", () => {
  const decided = [passed(), passed()].reduce(gameReducer, thatGame);

  expect(restoredRatings(inProgress, decided, NOW).inProgress).toBeUndefined();
});

it("leaves ratings with nothing in progress exactly as they were", () => {
  expect(restoredRatings(freshRatings(), thatGame, NOW)).toEqual(freshRatings());
});
