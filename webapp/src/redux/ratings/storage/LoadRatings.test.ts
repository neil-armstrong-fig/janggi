import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import {RATINGS_STORAGE_KEY} from "@src/redux/ratings/storage/RatingsStorageKey";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {expect, it} from "vitest";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {loadRatings} from "@src/redux/ratings/storage/LoadRatings";
import {saveJson} from "@src/redux/device-storage/SaveJson";

/** A stand-in for `localStorage`, holding whatever it is handed. */
function storageHolding(stored: Record<string, string>): Storage {
  const items = new Map(Object.entries(stored));

  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: key => items.get(key) ?? null,
    key: index => [...items.keys()][index] ?? null,
    removeItem: key => void items.delete(key),
    setItem: (key, value) => void items.set(key, value),
  };
}

const lostGame: GameRecord = {
  format: "Scored",
  botElo: 1600,
  playerSide: "han",
  result: "lost",
  ending: "points",
  eloBefore: 1200,
  eloAfter: 1185,
  finishedAt: "2026-09-14T10:20:00.000Z",
};

const played: RatingsSliceState = {
  byFormat: {Casual: freshRatings().byFormat.Casual, Scored: {elo: 1185, games: [lostGame]}},
  inProgress: {format: "Casual", botElo: 800, playerSide: "cho", startedAt: "2026-09-14T11:00:00.000Z"},
};

it("starts fresh when nothing has been stored", () => {
  expect(loadRatings(storageHolding({}))).toEqual(freshRatings());
});

it("starts fresh on a device with no storage to read", () => {
  expect(loadRatings(undefined)).toEqual(freshRatings());
});

it("reads back exactly what was saved", () => {
  const storage = storageHolding({});
  saveJson(storage, RATINGS_STORAGE_KEY, played);

  expect(loadRatings(storage)).toEqual(played);
});

it("starts fresh when what is stored is not JSON", () => {
  expect(loadRatings(storageHolding({[RATINGS_STORAGE_KEY]: "{not json"}))).toEqual(freshRatings());
});

it("starts a format fresh when its rating is not a number", () => {
  const stored = JSON.stringify({...played, byFormat: {...played.byFormat, Scored: {elo: "1185", games: []}}});

  expect(loadRatings(storageHolding({[RATINGS_STORAGE_KEY]: stored})).byFormat.Scored).toEqual(
    freshRatings().byFormat.Scored,
  );
});

it("drops a stored game against a bot strength the app does not offer", () => {
  const stored = JSON.stringify({
    ...played,
    byFormat: {...played.byFormat, Scored: {elo: 1185, games: [lostGame, {...lostGame, botElo: 1234}]}},
  });

  expect(loadRatings(storageHolding({[RATINGS_STORAGE_KEY]: stored})).byFormat.Scored.games).toEqual([lostGame]);
});

it("forgets a game in progress it cannot make sense of", () => {
  const stored = JSON.stringify({...played, inProgress: {format: "Blitz", botElo: 800, playerSide: "cho"}});

  expect(loadRatings(storageHolding({[RATINGS_STORAGE_KEY]: stored})).inProgress).toBeUndefined();
});

it("starts fresh when the storage refuses to be read", () => {
  const refusing: Storage = {
    ...storageHolding({}),
    getItem: () => {
      throw new Error("SecurityError");
    },
  };

  expect(loadRatings(refusing)).toEqual(freshRatings());
});
