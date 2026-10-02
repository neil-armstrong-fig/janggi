import {expect, it} from "vitest";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";

it("picks out the preferences that follow a player and leaves the device's own behind", () => {
  const preferences = {...defaultPreferences(), musicVolume: 3, boardStyle: "Neon", effects: "Reduced" as const};

  expect(syncedPreferencesOf(preferences)).toEqual({
    movableHighlight: preferences.movableHighlight,
    bikjangHint: preferences.bikjangHint,
  });
});

it("does not change when only a device's own preference does", () => {
  const before = syncedPreferencesOf(defaultPreferences());
  const after = syncedPreferencesOf({
    ...defaultPreferences(),
    soundEffectsVolume: 0,
    sheetOpacity: 60,
    flipBoardForHan: true,
  });

  expect(after).toEqual(before);
});
