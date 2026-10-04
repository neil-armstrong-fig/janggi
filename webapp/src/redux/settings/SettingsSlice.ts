import type {PayloadAction} from "@reduxjs/toolkit";
import type {SettingsSliceState} from "@src/redux/settings/types/SettingsSliceState";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {SheetName} from "@src/redux/settings/types/SheetName";
import {createSlice} from "@reduxjs/toolkit";

/**
 * The sheets over the game. Opening one puts away whichever was up, which is how the settings sheet makes
 * way for the record and the styles it opens, and closing puts away whichever is up.
 */
export const settingsSlice = createSlice({
  name: "settings",
  initialState: {openSheet: undefined, tab: "Play", accountHighlighted: false, showings: 0} as SettingsSliceState,
  reducers: {
    sheetOpened: (state, action: PayloadAction<SheetName>): SettingsSliceState => ({
      ...state,
      openSheet: action.payload,
      accountHighlighted: false,
      showings: state.showings + 1,
    }),

    sheetClosed: (state): SettingsSliceState => ({...state, openSheet: undefined, accountHighlighted: false}),

    /** Sends a signed-out player to the account card, which is picked out until they do something else. */
    signInPrompted: (state): SettingsSliceState => ({
      ...state,
      openSheet: "settings",
      tab: "You",
      accountHighlighted: true,
      showings: state.showings + 1,
    }),

    settingsTabSelected: (state, action: PayloadAction<SettingsTabName>): SettingsSliceState => ({
      ...state,
      tab: action.payload,
      accountHighlighted: false,
      showings: state.showings + 1,
    }),
  },
});

export const {sheetOpened, sheetClosed, settingsTabSelected, signInPrompted} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
