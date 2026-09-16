import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {added} from "@src/redux/custom-styles/joining/Added";
import {createSlice} from "@reduxjs/toolkit";
import {mergedAll} from "@src/redux/custom-styles/joining/MergedAll";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {saved} from "@src/redux/custom-styles/joining/Saved";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";

/**
 * The player's own board styles and piece sets: imported from a key somebody shared, made in the
 * editor, or carried in a save.
 *
 * **A name picks one style out**, because preferences hold a style by name — so no two of the player's
 * own styles of one kind share a name, and none takes a built-in's. A style imported under a name that is
 * already taken is kept under that name with a number after it; one *saved* from the editor under the
 * name of one of the player's own replaces it, that being what saving an edit means. A save loaded twice
 * adds its styles once: a style already here exactly as it is in the save is not added again.
 *
 * Every action is handed a style that has already been checked. The checking is `BoardStyleFrom` and
 * `PieceSetStyleFrom`, run where the player pasted or typed it, so the reason can be shown there.
 */
export const customStylesSlice = createSlice({
  name: "customStyles",
  initialState: noCustomStyles(),
  reducers: {
    boardStyleImported: (state, action: PayloadAction<BoardStyle>): CustomStylesSliceState => ({
      ...state,
      boards: added(state.boards, action.payload, BOARD_STYLE_NAMES),
    }),

    pieceSetImported: (state, action: PayloadAction<PieceSetStyle>): CustomStylesSliceState => ({
      ...state,
      pieceSets: added(state.pieceSets, action.payload, PIECE_SET_NAMES),
    }),

    boardStyleSaved: (state, action: PayloadAction<BoardStyle>): CustomStylesSliceState => ({
      ...state,
      boards: saved(state.boards, action.payload, BOARD_STYLE_NAMES),
    }),

    pieceSetSaved: (state, action: PayloadAction<PieceSetStyle>): CustomStylesSliceState => ({
      ...state,
      pieceSets: saved(state.pieceSets, action.payload, PIECE_SET_NAMES),
    }),

    boardStyleDeleted: (state, action: PayloadAction<string>): CustomStylesSliceState => ({
      ...state,
      boards: state.boards.filter(style => style.name !== action.payload),
    }),

    pieceSetDeleted: (state, action: PayloadAction<string>): CustomStylesSliceState => ({
      ...state,
      pieceSets: state.pieceSets.filter(set => set.name !== action.payload),
    }),
  },
  extraReducers: builder => {
    builder.addCase(saveLoaded, (state, action): CustomStylesSliceState => ({
      boards: mergedAll(state.boards, action.payload.customStyles.boards, BOARD_STYLE_NAMES),
      pieceSets: mergedAll(state.pieceSets, action.payload.customStyles.pieceSets, PIECE_SET_NAMES),
    }));
  },
});

export const {
  boardStyleImported,
  pieceSetImported,
  boardStyleSaved,
  pieceSetSaved,
  boardStyleDeleted,
  pieceSetDeleted,
} = customStylesSlice.actions;

export const customStylesReducer = customStylesSlice.reducer;
