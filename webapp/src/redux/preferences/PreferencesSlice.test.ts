import {
  armyBoardStyleChosen,
  armyPieceSetChosen,
  bikjangHintChosen,
  boardStyleChosen,
  boardStyleSplit,
  effectsChosen,
  movableHighlightChosen,
  musicVolumeChanged,
  pieceSetChosen,
  pieceSetSplit,
  preferencesReducer,
  sheetOpacityChanged,
  soundEffectsVolumeChanged,
} from "@src/redux/preferences/PreferencesSlice";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import {expect, it} from "vitest";

it("starts on the classic board and the modern set, with every mark, motion and sound in full", () => {
  expect(initial()).toEqual({
    boardStyle: "Classic",
    hanBoardStyle: undefined,
    pieceSet: "Modern",
    hanPieceSet: undefined,
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

it("chooses the board for both armies at once, putting them back together after being chosen apart", () => {
  const apart = {...initial(), boardStyle: "Neon", hanBoardStyle: "Dancheong"};

  expect(preferencesReducer(apart, boardStyleChosen("Classic"))).toEqual({
    ...initial(),
    boardStyle: "Classic",
    hanBoardStyle: undefined,
  });
});

it("chooses Han's board apart from Cho's", () => {
  expect(preferencesReducer(initial(), armyBoardStyleChosen({side: "han", name: "Dancheong"}))).toEqual({
    ...initial(),
    hanBoardStyle: "Dancheong",
  });
});

it("chooses Cho's board apart from Han's, leaving Han on the board both wore", () => {
  expect(preferencesReducer(initial(), armyBoardStyleChosen({side: "cho", name: "Neon"}))).toEqual({
    ...initial(),
    boardStyle: "Neon",
    hanBoardStyle: "Classic",
  });
});

it("leaves Han where the player put it when Cho's board is chosen", () => {
  const apart = {...initial(), hanBoardStyle: "Dancheong"};

  expect(preferencesReducer(apart, armyBoardStyleChosen({side: "cho", name: "Neon"}))).toEqual({
    ...initial(),
    boardStyle: "Neon",
    hanBoardStyle: "Dancheong",
  });
});

it("splits the armies with each still on the board both wore, which changes nothing on the board", () => {
  expect(preferencesReducer(initial(), boardStyleSplit())).toEqual({...initial(), hanBoardStyle: "Classic"});
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

it("chooses the pieces for both armies at once, putting them back together after being chosen apart", () => {
  const apart = {...initial(), pieceSet: "Hangul", hanPieceSet: "Hanja"};

  expect(preferencesReducer(apart, pieceSetChosen("Modern"))).toEqual({
    ...initial(),
    pieceSet: "Modern",
    hanPieceSet: undefined,
  });
});

it("chooses Han's pieces apart from Cho's", () => {
  expect(preferencesReducer(initial(), armyPieceSetChosen({side: "han", name: "Hanja"}))).toEqual({
    ...initial(),
    hanPieceSet: "Hanja",
  });
});

it("chooses Cho's pieces apart from Han's, leaving Han in the set both wore", () => {
  expect(preferencesReducer(initial(), armyPieceSetChosen({side: "cho", name: "Hangul"}))).toEqual({
    ...initial(),
    pieceSet: "Hangul",
    hanPieceSet: "Modern",
  });
});

it("leaves Han where the player put them when Cho's are chosen", () => {
  const apart = {...initial(), hanPieceSet: "Hanja"};

  expect(preferencesReducer(apart, armyPieceSetChosen({side: "cho", name: "Hangul"}))).toEqual({
    ...initial(),
    pieceSet: "Hangul",
    hanPieceSet: "Hanja",
  });
});

it("splits the armies with each still in the set both wore, which changes nothing on the board", () => {
  expect(preferencesReducer(initial(), pieceSetSplit())).toEqual({...initial(), hanPieceSet: "Modern"});
});
