import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {expect, it} from "vitest";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {preferencesReducer} from "@src/redux/preferences/PreferencesSlice";

it("finds a board style for every name the store can hold", () => {
  for (const name of BOARD_STYLE_NAMES) {
    expect(preferencesFrom({...initial(), boardStyle: name}).boardStyle.name).toBe(name);
  }
});

it("finds a piece set for every name the store can hold", () => {
  for (const name of PIECE_SET_NAMES) {
    expect(preferencesFrom({...initial(), pieceSet: name}).pieceStyle.name).toBe(name);
  }
});

it("marks the movable pieces only while the mark is shown", () => {
  expect(MOVABLE_HIGHLIGHT_NAMES.map(name => preferencesFrom({...initial(), movableHighlight: name}))).toEqual([
    expect.objectContaining({movableHighlight: {name: "Shown", shown: true}}),
    expect.objectContaining({movableHighlight: {name: "Hidden", shown: false}}),
  ]);
});

it("moves the board in full only while effects are full", () => {
  expect(EFFECTS_NAMES.map(name => preferencesFrom({...initial(), effects: name}))).toEqual([
    expect.objectContaining({effects: {name: "Full", full: true}}),
    expect.objectContaining({effects: {name: "Reduced", full: false}}),
  ]);
});

it("hands both volumes on as they are", () => {
  const preferences = preferencesFrom({...initial(), soundEffectsVolume: 40, musicVolume: 25});

  expect(preferences.soundEffectsVolume).toBe(40);
  expect(preferences.musicVolume).toBe(25);
});

function initial(): PreferencesSliceState {
  return preferencesReducer(undefined, {type: "test/initialised"});
}
