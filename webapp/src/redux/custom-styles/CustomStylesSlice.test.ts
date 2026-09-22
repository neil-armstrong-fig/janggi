import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {
  boardStyleDeleted,
  boardStyleImported,
  boardStyleSaved,
  customStylesReducer,
  pieceSetImported,
} from "@src/redux/custom-styles/CustomStylesSlice";
import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";

it("adds an imported board style under its own name", () => {
  expect(customStylesReducer(noCustomStyles(), boardStyleImported(board("Mine"))).boards).toEqual([board("Mine")]);
});

/** How a name is settled, and when a style replaces one, is `joining/`. These are the actions reaching it. */
it("replaces the player's own style of the same name when one is saved from the editor", () => {
  const edited = customStylesReducer(holding(board("Mine")), boardStyleSaved(board("Mine", "#000")));

  expect(edited.boards).toEqual([board("Mine", "#000")]);
});

it("saves a style under a built-in's name beside the built-in rather than over it", () => {
  expect(namesOf(customStylesReducer(noCustomStyles(), boardStyleSaved(board("Neon"))))).toEqual(["Neon (2)"]);
});

it("deletes only the style named", () => {
  const state = {...noCustomStyles(), boards: [board("Mine"), board("Other")]};

  expect(namesOf(customStylesReducer(state, boardStyleDeleted("Mine")))).toEqual(["Other"]);
});

it("keeps board styles and piece sets apart, so each may have a name the other has", () => {
  const state = customStylesReducer(holding(board("Mine")), pieceSetImported(pieceSet("Mine")));

  expect(state.pieceSets.map(set => set.name)).toEqual(["Mine"]);
});

it("adds each style a loaded save carries, and none the player already has", () => {
  const loaded = customStylesReducer(
    holding(board("Mine")),
    saveLoaded({progress: freshProgress(), customStyles: {boards: [board("Mine"), board("Other")], pieceSets: []}}),
  );

  expect(namesOf(loaded)).toEqual(["Mine", "Other"]);
});

it("keeps both where a save carries a different style under a name the player already has", () => {
  const loaded = customStylesReducer(
    holding(board("Mine")),
    saveLoaded({progress: freshProgress(), customStyles: {boards: [board("Mine", "#000")], pieceSets: []}}),
  );

  expect(loaded.boards).toEqual([board("Mine"), board("Mine (2)", "#000")]);
});

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    ...DEFAULT_BOARD_MARKS,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}

function pieceSet(name: string): PieceSetStyle {
  const piece = {
    body: {shape: "disc", fill: "#fff", stroke: "#000", strokeWidth: 1},
    glyph: {
      kind: "pictograph",
      pictographs: {general: "", guard: "", horse: "", elephant: "", chariot: "", cannon: "", soldier: ""},
      colour: "#000",
      scale: 0.7,
    },
    size: 0.86,
  } as const;

  return {name, sides: {han: piece, cho: piece}, handling: DEFAULT_PIECE_HANDLING};
}

function holding(style: BoardStyle): CustomStylesSliceState {
  return {...noCustomStyles(), boards: [style]};
}

function namesOf(state: CustomStylesSliceState): readonly string[] {
  return state.boards.map(style => style.name);
}
