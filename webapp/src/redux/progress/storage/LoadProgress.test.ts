import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import {PROGRESS_STORAGE_KEY} from "@src/redux/progress/storage/ProgressStorageKey";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {loadProgress} from "@src/redux/progress/storage/LoadProgress";
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

const game: GameRecord = {
  format: "Casual",
  botElo: 800,
  playerSide: "cho",
  result: "won",
  ending: "checkmate",
  eloBefore: 1200,
  eloAfter: 1210,
  finishedAt: "2026-09-14T10:20:00.000Z",
};

/** A record of a casual win as Cho, a scored win as Han, and a casual game walked away from. */
const played: RatingsSliceState = {
  byFormat: {
    Casual: {elo: 1190, games: [game, {...game, result: "lost", ending: "abandoned"}]},
    Scored: {elo: 1215, games: [{...game, format: "Scored", playerSide: "han"}]},
  },
  inProgress: undefined,
};

it("reads back exactly what was saved", () => {
  const storage = storageHolding({});
  const progress = {
    xp: 640,
    beaten: {Casual: {cho: [800, 1000], han: [800]}, Scored: {cho: [], han: []}},
  };
  saveJson(storage, PROGRESS_STORAGE_KEY, progress);

  expect(loadProgress(storage, played)).toEqual(progress);
});

it("credits a device that has kept no progress with every decided game in the record", () => {
  expect(loadProgress(storageHolding({}), played)).toEqual({
    xp: 30 + 40,
    beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: [800]}},
  });
});

it("starts a device with no record and no progress from nothing", () => {
  expect(loadProgress(storageHolding({}), freshRatings())).toEqual(freshProgress());
});

it("starts fresh, rather than crediting the record again, where what is kept is not progress", () => {
  expect(loadProgress(storageHolding({[PROGRESS_STORAGE_KEY]: JSON.stringify("broken")}), played)).toEqual(
    freshProgress(),
  );
});
