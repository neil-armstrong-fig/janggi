import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {expect, it} from "vitest";
import {loadPreferences} from "@src/redux/preferences/storage/LoadPreferences";

function storageHolding(value: unknown): Pick<Storage, "getItem"> {
  return {getItem: key => (key === PREFERENCES_STORAGE_KEY ? JSON.stringify(value) : null)};
}

const chosen: PreferencesSliceState = {
  boardStyle: "Neon",
  pieceSet: "Hangul",
  movableHighlight: "Hidden",
  effects: "Reduced",
  soundEffectsVolume: 40,
  musicVolume: 0,
};

it("starts from the defaults when nothing has been kept", () => {
  expect(loadPreferences({getItem: () => null})).toEqual(defaultPreferences());
});

it("reads back every preference that was kept", () => {
  expect(loadPreferences(storageHolding(chosen))).toEqual(chosen);
});

it("puts back the default for a style the app no longer ships, and keeps the rest", () => {
  expect(loadPreferences(storageHolding({...chosen, boardStyle: "Marble"}))).toEqual({
    ...chosen,
    boardStyle: defaultPreferences().boardStyle,
  });
});

it("puts back the default for a volume outside the slider's range", () => {
  expect(loadPreferences(storageHolding({...chosen, musicVolume: 400})).musicVolume).toBe(
    defaultPreferences().musicVolume,
  );
  expect(loadPreferences(storageHolding({...chosen, soundEffectsVolume: "loud"})).soundEffectsVolume).toBe(
    defaultPreferences().soundEffectsVolume,
  );
});

it("starts from the defaults when what is kept is not an object at all", () => {
  expect(loadPreferences(storageHolding(["Neon"]))).toEqual(defaultPreferences());
});
