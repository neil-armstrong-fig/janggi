import {
  bikjangHintChosen,
  boardStyleChosen,
  effectsChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  pieceSetChosen,
  preferencesReducer,
  sheetOpacityChanged,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {expect, it} from "vitest";

it("starts on the classic board and the modern set, with every mark, motion and sound in full", () => {
  expect(initial()).toEqual({
    boardStyle: "Classic",
    pieceSet: "Modern",
    movableHighlight: "Shown",
    bikjangHint: "Shown",
    effects: "Full",
    soundEffectsVolume: 100,
    musicVolume: 100,
    sheetOpacity: 90,
  });
});

it("wears the board style chosen", () => {
  expect(preferencesReducer(initial(), boardStyleChosen("Neon"))).toEqual({...initial(), boardStyle: "Neon"});
});

it("wears the piece set chosen", () => {
  expect(preferencesReducer(initial(), pieceSetChosen("Modern"))).toEqual({...initial(), pieceSet: "Modern"});
});

it("shows or hides the movable-piece mark as chosen", () => {
  expect(preferencesReducer(initial(), movableHighlightChosen("Hidden"))).toEqual({
    ...initial(),
    movableHighlight: "Hidden",
  });
});

it("shows or hides the bikjang hint as chosen", () => {
  expect(preferencesReducer(initial(), bikjangHintChosen("Hidden"))).toEqual({
    ...initial(),
    bikjangHint: "Hidden",
  });
});

it("moves the board as much as chosen", () => {
  expect(preferencesReducer(initial(), effectsChosen("Reduced"))).toEqual({...initial(), effects: "Reduced"});
});

it("plays the sound effects at the volume chosen", () => {
  expect(preferencesReducer(initial(), soundEffectsVolumeChanged(40))).toEqual({
    ...initial(),
    soundEffectsVolume: 40,
  });
});

it("plays the music at the volume chosen", () => {
  expect(preferencesReducer(initial(), musicVolumeChanged(25))).toEqual({...initial(), musicVolume: 25});
});

it("keeps the sheet at the opacity chosen", () => {
  expect(preferencesReducer(initial(), sheetOpacityChanged(85))).toEqual({...initial(), sheetOpacity: 85});
});

function initial(): PreferencesSliceState {
  return preferencesReducer(undefined, {type: "test/initialised"});
}
