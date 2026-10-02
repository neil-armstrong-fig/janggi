import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import {MAX_SYNCED_GAMES_PER_FORMAT} from "@src/redux/account/data/MaxSyncedGames";
import {syncDataText} from "@src/redux/account/data/SyncDataText";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {syncDataFrom} from "@src/redux/account/data/SyncDataFrom";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

function game(minute: number): GameRecord {
  const finishedAt = new Date(Date.UTC(2026, 0, 1, 0, minute)).toISOString();

  return {
    format: "Casual",
    botElo: 800,
    playerSide: "cho",
    result: "won",
    ending: "checkmate",
    eloBefore: 1200,
    eloAfter: 1210,
    finishedAt,
  };
}

function data(overrides: Partial<SyncData> = {}): SyncData {
  return {
    progress: {...freshProgress(), xp: 640},
    styles: {boards: [{id: "a", at: 5, style: mine}], pieceSets: [], deleted: [{kind: "Pieces", id: "gone", at: 7}]},
    ratings: {byFormat: freshRatings().byFormat, resetAt: "2026-01-01T00:00:00Z"},
    preferences: {value: {...syncedPreferencesOf(defaultPreferences()), bikjangHint: "Hidden"}, at: 9},
    ...overrides,
  };
}

it("reads back what it wrote", () => {
  expect(syncDataFrom(syncDataText(data()))).toEqual(data());
});

it("writes the same text for the same things, however the styles are ordered", () => {
  const other = {...mine, name: "Other"};
  const first = data({
    styles: {
      boards: [
        {id: "a", at: 1, style: mine},
        {id: "b", at: 2, style: other},
      ],
      pieceSets: [],
      deleted: [],
    },
  });
  const second = data({
    styles: {
      boards: [
        {id: "b", at: 2, style: other},
        {id: "a", at: 1, style: mine},
      ],
      pieceSets: [],
      deleted: [],
    },
  });

  expect(syncDataText(first)).toBe(syncDataText(second));
});

it("keeps only the latest games of each format, the device keeping the rest", () => {
  const fresh = freshRatings().byFormat;
  const games = Array.from({length: MAX_SYNCED_GAMES_PER_FORMAT + 5}, (_, minute) => game(minute));
  const text = syncDataText(
    data({ratings: {byFormat: {...fresh, Casual: {...fresh.Casual, games}}, resetAt: undefined}}),
  );

  const read = syncDataFrom(text)?.ratings.byFormat.Casual.games;

  expect(read).toHaveLength(MAX_SYNCED_GAMES_PER_FORMAT);
  expect(read?.at(-1)).toEqual(games.at(-1));
});

it("refuses text that is not JSON, not an object, or of another version", () => {
  expect(syncDataFrom("{nope")).toBeUndefined();
  expect(syncDataFrom("[]")).toBeUndefined();
  expect(syncDataFrom(JSON.stringify({...JSON.parse(syncDataText(data())), v: 2}))).toBeUndefined();
});

it("refuses a document with no progress", () => {
  const {progress: _progress, ...without} = JSON.parse(syncDataText(data()));

  expect(syncDataFrom(JSON.stringify(without))).toBeUndefined();
});

it("keeps what checks out and drops what does not, a part at a time", () => {
  const document = JSON.parse(syncDataText(data()));
  document.styles.boards.push({id: "b", at: 1, style: {name: "Broken"}}, {at: 1, style: mine});
  document.styles.deleted.push({kind: "Sky", id: "x", at: 1});
  document.ratings = "nonsense";
  document.preferences = null;

  const read = syncDataFrom(JSON.stringify(document));

  expect(read?.styles.boards.map(entry => entry.id)).toEqual(["a"]);
  expect(read?.styles.deleted).toEqual([{kind: "Pieces", id: "gone", at: 7}]);
  expect(read?.ratings).toEqual({byFormat: freshRatings().byFormat, resetAt: undefined});
  expect(read?.preferences).toEqual({value: syncedPreferencesOf(defaultPreferences()), at: 0});
  expect(read?.progress.xp).toBe(640);
});
