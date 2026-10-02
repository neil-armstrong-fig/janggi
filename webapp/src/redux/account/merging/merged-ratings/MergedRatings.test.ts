import {expect, it} from "vitest";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {SyncedRatings} from "@src/redux/account/data/types/SyncedRatings";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {mergedRatings} from "@src/redux/account/merging/merged-ratings/MergedRatings";

function game(finishedAt: string, eloAfter: number, format: GameRecord["format"] = "Casual"): GameRecord {
  return {
    format,
    botElo: 800,
    playerSide: "cho",
    result: "won",
    ending: "checkmate",
    eloBefore: 1000,
    eloAfter,
    finishedAt,
  };
}

function holding(games: GameRecord[], resetAt?: string): SyncedRatings {
  const fresh = freshRatings().byFormat;

  return {byFormat: {...fresh, Casual: {...fresh.Casual, games}}, resetAt};
}

const FRESH_ELO = freshRatings().byFormat.Casual.elo;

it("keeps the games of both devices, oldest first", () => {
  const merged = mergedRatings(
    holding([game("2026-01-03T00:00:00Z", 1030)]),
    holding([game("2026-01-01T00:00:00Z", 1010), game("2026-01-05T00:00:00Z", 1050)]),
  );

  expect(merged.byFormat.Casual.games.map(each => each.finishedAt)).toEqual([
    "2026-01-01T00:00:00Z",
    "2026-01-03T00:00:00Z",
    "2026-01-05T00:00:00Z",
  ]);
});

it("counts a game both devices hold once", () => {
  const both = [game("2026-01-01T00:00:00Z", 1010)];

  expect(mergedRatings(holding(both), holding(both)).byFormat.Casual.games).toHaveLength(1);
});

it("rates the player where the latest game left them", () => {
  const merged = mergedRatings(
    holding([game("2026-01-03T00:00:00Z", 1030)]),
    holding([game("2026-01-01T00:00:00Z", 1010)]),
  );

  expect(merged.byFormat.Casual.elo).toBe(1030);
});

it("rates a player with no games as a newcomer", () => {
  expect(mergedRatings(holding([]), holding([])).byFormat.Casual.elo).toBe(FRESH_ELO);
});

it("keeps the formats apart", () => {
  const fresh = freshRatings().byFormat;
  const scored: SyncedRatings = {
    byFormat: {...fresh, Scored: {...fresh.Scored, games: [game("2026-01-01T00:00:00Z", 1010, "Scored")]}},
    resetAt: undefined,
  };

  const merged = mergedRatings(scored, holding([]));

  expect(merged.byFormat.Casual.games).toEqual([]);
  expect(merged.byFormat.Scored.games).toHaveLength(1);
});

it("drops the games of a record the player has since started again, wherever they are held", () => {
  const merged = mergedRatings(
    holding([game("2026-01-01T00:00:00Z", 1010)]),
    holding([game("2026-02-01T00:00:00Z", 1020)], "2026-01-15T00:00:00Z"),
  );

  expect(merged.byFormat.Casual.games.map(each => each.finishedAt)).toEqual(["2026-02-01T00:00:00Z"]);
  expect(merged.resetAt).toBe("2026-01-15T00:00:00Z");
});

it("keeps the later of two resets", () => {
  expect(mergedRatings(holding([], "2026-03-01T00:00:00Z"), holding([], "2026-01-01T00:00:00Z")).resetAt).toBe(
    "2026-03-01T00:00:00Z",
  );
  expect(mergedRatings(holding([], "2026-01-01T00:00:00Z"), holding([], "2026-03-01T00:00:00Z")).resetAt).toBe(
    "2026-03-01T00:00:00Z",
  );
});

it("has no reset where neither device does", () => {
  expect(mergedRatings(holding([]), holding([])).resetAt).toBeUndefined();
});

it("counts a game finished at the very moment of the reset as part of the record thrown away", () => {
  const merged = mergedRatings(holding([game("2026-01-15T00:00:00Z", 1010)]), holding([], "2026-01-15T00:00:00Z"));

  expect(merged.byFormat.Casual.games).toEqual([]);
});
