import {expect, it} from "vitest";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {mergedSyncData} from "@src/redux/account/merging/MergedSyncData";

function data(overrides: Partial<SyncData> = {}): SyncData {
  return {
    progress: freshProgress(),
    styles: {boards: [], pieceSets: [], deleted: []},
    ratings: {byFormat: freshRatings().byFormat, resetAt: undefined},
    preferences: {value: syncedPreferencesOf(defaultPreferences()), at: 0},
    ...overrides,
  };
}

const withPreferences = (bikjangHint: BikjangHintName, at: number): SyncData =>
  data({preferences: {value: {...syncedPreferencesOf(defaultPreferences()), bikjangHint}, at}});

it("carries the progress of whichever device has gone further", () => {
  const merged = mergedSyncData(
    data({progress: {...freshProgress(), xp: 640}}),
    data({progress: {...freshProgress(), xp: 900}}),
  );

  expect(merged.progress.xp).toBe(900);
});

it("takes the preferences chosen most recently, whole, whichever device made them", () => {
  expect(mergedSyncData(withPreferences("Shown", 5), withPreferences("Hidden", 9)).preferences.value.bikjangHint).toBe(
    "Hidden",
  );
  expect(mergedSyncData(withPreferences("Shown", 9), withPreferences("Hidden", 5)).preferences.value.bikjangHint).toBe(
    "Shown",
  );
});

it("keeps this device's preferences, and their time, where both were chosen at once", () => {
  expect(mergedSyncData(withPreferences("Shown", 5), withPreferences("Hidden", 5)).preferences).toEqual(
    withPreferences("Shown", 5).preferences,
  );
});

it("settles the styles and the record each by their own rules", () => {
  const merged = mergedSyncData(
    data({styles: {boards: [], pieceSets: [], deleted: [{kind: "Board", id: "a", at: 1}]}}),
    data({ratings: {byFormat: freshRatings().byFormat, resetAt: "2026-01-01T00:00:00Z"}}),
  );

  expect(merged.styles.deleted).toHaveLength(1);
  expect(merged.ratings.resetAt).toBe("2026-01-01T00:00:00Z");
});
