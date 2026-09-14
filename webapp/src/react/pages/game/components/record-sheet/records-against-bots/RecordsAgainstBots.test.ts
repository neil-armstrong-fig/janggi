import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import {expect, it} from "vitest";
import {recordsAgainstBots} from "@src/react/pages/game/components/record-sheet/records-against-bots/RecordsAgainstBots";

const game: GameRecord = {
  format: "Casual",
  botElo: 1400,
  playerSide: "cho",
  result: "won",
  ending: "checkmate",
  eloBefore: 1200,
  eloAfter: 1230,
  finishedAt: "2026-09-14T10:00:00.000Z",
};

it("has a row for every strength of bot, weakest first, whether or not it has been played", () => {
  expect(recordsAgainstBots([]).map(({botElo}) => botElo)).toEqual([...BOT_ELOS]);
});

it("counts nothing against a bot never played", () => {
  expect(recordsAgainstBots([])[0]).toEqual({
    botElo: 800,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    asCho: {played: 0, won: 0},
    asHan: {played: 0, won: 0},
  });
});

it("counts each result against the strength it was played at, and no other", () => {
  const games: GameRecord[] = [
    game,
    {...game, result: "drawn", ending: "bikjang"},
    {...game, result: "lost", ending: "abandoned"},
    {...game, botElo: 800, result: "lost"},
  ];

  const against1400 = recordsAgainstBots(games).find(({botElo}) => botElo === 1400);
  const against800 = recordsAgainstBots(games).find(({botElo}) => botElo === 800);

  expect(against1400).toMatchObject({played: 3, won: 1, drawn: 1, lost: 1});
  expect(against800).toMatchObject({played: 1, won: 0, drawn: 0, lost: 1});
});

it("splits the games by the army the player had", () => {
  const games: GameRecord[] = [game, {...game, result: "lost"}, {...game, playerSide: "han"}];

  expect(recordsAgainstBots(games).find(({botElo}) => botElo === 1400)).toMatchObject({
    asCho: {played: 2, won: 1},
    asHan: {played: 1, won: 1},
  });
});
