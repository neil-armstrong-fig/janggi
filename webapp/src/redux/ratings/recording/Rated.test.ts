import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {expect, it} from "vitest";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {rated} from "@src/redux/ratings/recording/Rated";

const scoredAgainst1200: RatedGameInProgress = {
  format: "Scored",
  botElo: 1200,
  playerSide: "han",
  startedAt: "2026-09-14T10:00:00.000Z",
};

const inProgress: RatingsSliceState = {...freshRatings(), inProgress: scoredAgainst1200};

const WON = {result: "won", ending: "checkmate", finishedAt: "2026-09-14T10:20:00.000Z"} as const;

it("leaves a record with no game in progress exactly as it is", () => {
  const untouched = freshRatings();

  expect(rated(untouched, WON)).toBe(untouched);
});

it("writes the game into the format it was played in", () => {
  expect(rated(inProgress, WON).byFormat.Scored.games).toEqual([
    {
      format: "Scored",
      botElo: 1200,
      playerSide: "han",
      result: "won",
      ending: "checkmate",
      eloBefore: 1200,
      eloAfter: 1220,
      finishedAt: WON.finishedAt,
    },
  ]);
});

it("moves the rating of that format, and of no other", () => {
  const after = rated(inProgress, WON);

  expect(after.byFormat.Scored.elo).toBe(1220);
  expect(after.byFormat.Casual).toEqual(freshRatings().byFormat.Casual);
});

it("keeps where the rating moved from and to on the game itself", () => {
  const lost = rated(inProgress, {result: "lost", ending: "points", finishedAt: WON.finishedAt});

  expect(lost.byFormat.Scored.games[0]).toMatchObject({eloBefore: 1200, eloAfter: lost.byFormat.Scored.elo});
});

it("rates a game against the bot it was played against, whatever is asked of it", () => {
  const against800: RatingsSliceState = {...freshRatings(), inProgress: {...scoredAgainst1200, botElo: 800}};

  expect(rated(against800, WON).byFormat.Scored.games[0]).toMatchObject({botElo: 800, playerSide: "han"});
});

it("has nothing left in progress once a game is rated", () => {
  expect(rated(inProgress, WON).inProgress).toBeUndefined();
});
