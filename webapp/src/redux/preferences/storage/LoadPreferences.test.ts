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
  bikjangHint: "Hidden",
  effects: "Reduced",
  soundEffectsVolume: 40,
  musicVolume: 0,
  sheetOpacity: 85,
};

it("starts from the defaults when nothing has been kept", () => {
  expect(loadPreferences({getItem: () => null})).toEqual(defaultPreferences());
});

it("reads back every preference that was kept", () => {
  expect(loadPreferences(storageHolding(chosen))).toEqual(chosen);
});

it("keeps a style's name it has no list to check against, for the page to look up", () => {
  expect(loadPreferences(storageHolding({...chosen, boardStyle: "My own board", pieceSet: "My own pieces"}))).toEqual({
    ...chosen,
    boardStyle: "My own board",
    pieceSet: "My own pieces",
  });
});

it("puts back the default for a style that is not named at all, and keeps the rest", () => {
  expect(loadPreferences(storageHolding({...chosen, boardStyle: 42, pieceSet: ""}))).toEqual({
    ...chosen,
    boardStyle: defaultPreferences().boardStyle,
    pieceSet: defaultPreferences().pieceSet,
  });
});

/** A player who last saved before the hint existed has no such field, and loses nothing else for it. */
it("puts back the default for a bikjang hint that was never kept, and keeps the rest", () => {
  const {bikjangHint: _never, ...savedBeforeTheHint} = chosen;

  expect(loadPreferences(storageHolding(savedBeforeTheHint))).toEqual({
    ...chosen,
    bikjangHint: defaultPreferences().bikjangHint,
  });
});

it("puts back the default for a bikjang hint the app does not offer", () => {
  expect(loadPreferences(storageHolding({...chosen, bikjangHint: "Loud"})).bikjangHint).toBe(
    defaultPreferences().bikjangHint,
  );
});

it("puts back the default for a volume outside the slider's range", () => {
  expect(loadPreferences(storageHolding({...chosen, musicVolume: 400})).musicVolume).toBe(
    defaultPreferences().musicVolume,
  );
  expect(loadPreferences(storageHolding({...chosen, soundEffectsVolume: "loud"})).soundEffectsVolume).toBe(
    defaultPreferences().soundEffectsVolume,
  );
});

it("puts back the default for a sheet opacity outside the slider's range", () => {
  expect(loadPreferences(storageHolding({...chosen, sheetOpacity: 40})).sheetOpacity).toBe(
    defaultPreferences().sheetOpacity,
  );
  expect(loadPreferences(storageHolding({...chosen, sheetOpacity: "see-through"})).sheetOpacity).toBe(
    defaultPreferences().sheetOpacity,
  );
});

it("starts from the defaults when what is kept is not an object at all", () => {
  expect(loadPreferences(storageHolding(["Neon"]))).toEqual(defaultPreferences());
});
