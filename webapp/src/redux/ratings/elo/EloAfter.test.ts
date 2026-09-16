import {eloAfter} from "@src/redux/ratings/elo/EloAfter";
import {expect, it} from "vitest";

it("loses twenty points for a first loss to an equal opponent", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 1200, result: "lost"})).toBe(1180);
});

it("gains twenty points for a first win over an equal opponent", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 1200, result: "won"})).toBe(1220);
});

it("stays put after a draw with an equal opponent", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 1200, result: "drawn"})).toBe(1200);
});

it("gains more for beating a stronger opponent than a weaker one", () => {
  const overStronger = eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 1600, result: "won"});
  const overWeaker = eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 800, result: "won"});

  expect(overStronger - 1200).toBeGreaterThan(overWeaker - 1200);
});

it("loses little for losing to a far stronger opponent", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 2850, result: "lost"})).toBe(1200);
});

it("gains from a draw with a stronger opponent and loses from a draw with a weaker one", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 1600, result: "drawn"})).toBeGreaterThan(1200);
  expect(eloAfter({elo: 1200, gamesPlayed: 0, opponentElo: 800, result: "drawn"})).toBeLessThan(1200);
});

it("moves half as far once thirty games are behind it and the rating has settled", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 30, opponentElo: 1200, result: "lost"})).toBe(1190);
});

it("still moves the full distance on the thirtieth game", () => {
  expect(eloAfter({elo: 1200, gamesPlayed: 29, opponentElo: 1200, result: "lost"})).toBe(1180);
});
