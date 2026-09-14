import {
  boardStyleChosen,
  effectsChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  pieceSetChosen,
  preferencesReducer,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {expect, it} from "vitest";

it("starts on the classic board and the traditional set, with every mark, motion and sound in full", () => {
  expect(initial()).toEqual({
    boardStyle: "Classic",
    pieceSet: "Traditional",
    movableHighlight: "Shown",
    effects: "Full",
    soundEffectsVolume: 100,
    musicVolume: 100,
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

function initial(): PreferencesSliceState {
  return preferencesReducer(undefined, {type: "test/initialised"});
}
