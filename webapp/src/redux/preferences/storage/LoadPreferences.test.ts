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
  hanBoardStyle: undefined,
  pieceSet: "Hangul",
  hanPieceSet: undefined,
  movableHighlight: "Hidden",
  bikjangHint: "Hidden",
  flipBoardForHan: true,
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

it("puts back the default for a flip that was never kept or is not a yes or no", () => {
  const {flipBoardForHan: _never, ...savedBeforeTheFlip} = chosen;

  expect(loadPreferences(storageHolding(savedBeforeTheFlip)).flipBoardForHan).toBe(
    defaultPreferences().flipBoardForHan,
  );
  expect(loadPreferences(storageHolding({...chosen, flipBoardForHan: "yes"})).flipBoardForHan).toBe(
    defaultPreferences().flipBoardForHan,
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

it("reads back Han's board where it was chosen apart from Cho's", () => {
  expect(loadPreferences(storageHolding({...chosen, hanBoardStyle: "Dancheong"})).hanBoardStyle).toBe("Dancheong");
});

it("takes Han's board to be Cho's where none was kept, or what was kept is not a name", () => {
  expect(loadPreferences(storageHolding(chosen)).hanBoardStyle).toBeUndefined();
  expect(loadPreferences(storageHolding({...chosen, hanBoardStyle: 3})).hanBoardStyle).toBeUndefined();
  expect(loadPreferences(storageHolding({...chosen, hanBoardStyle: ""})).hanBoardStyle).toBeUndefined();
});

it("reads back Han's pieces where they were chosen apart from Cho's", () => {
  expect(loadPreferences(storageHolding({...chosen, hanPieceSet: "Hanja"})).hanPieceSet).toBe("Hanja");
});

it("takes Han's pieces to be Cho's where none were kept, or what was kept is not a name", () => {
  expect(loadPreferences(storageHolding(chosen)).hanPieceSet).toBeUndefined();
  expect(loadPreferences(storageHolding({...chosen, hanPieceSet: 3})).hanPieceSet).toBeUndefined();
  expect(loadPreferences(storageHolding({...chosen, hanPieceSet: ""})).hanPieceSet).toBeUndefined();
});
