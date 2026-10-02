import {expect, it} from "vitest";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {haveSyncedPreferencesChanged} from "@src/redux/preferences/synced/HaveSyncedPreferencesChanged";

const base = defaultPreferences();

it("sees a change to a preference that follows the player", () => {
  const other = base.bikjangHint === "Shown" ? "Hidden" : "Shown";

  expect(haveSyncedPreferencesChanged(base, {...base, bikjangHint: other})).toBe(true);
});

it("does not see a change to a preference that belongs to the device", () => {
  expect(haveSyncedPreferencesChanged(base, {...base, musicVolume: 0, boardStyle: "Neon", effects: "Reduced"})).toBe(
    false,
  );
});

it("sees nothing where nothing changed", () => {
  expect(haveSyncedPreferencesChanged(base, {...base})).toBe(false);
});
