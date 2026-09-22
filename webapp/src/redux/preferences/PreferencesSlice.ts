import type {PayloadAction} from "@reduxjs/toolkit";
import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";
import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {Opacity} from "@janggi/shared/janggi/settings/Opacity";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {createSlice} from "@reduxjs/toolkit";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";

/**
 * A player's preferences, one action each. Every reducer replaces a single field and returns a new
 * state, the way `GameSlice` does, and none of them touches the game: a preference is worn the moment
 * it is chosen, even half way through a game.
 *
 * The defaults are what a player gets before choosing anything: the board as it looks on a table, the
 * pieces as they really stand on it, every mark shown, the motion and the sound in full — the motion
 * being most of what makes the game feel alive, it is on until a player turns it down — and the sheet
 * at its middle, 90. Once chosen, a preference is kept on the device (`Store.ts`).
 */
export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: defaultPreferences(),
  reducers: {
    boardStyleChosen: (state, action: PayloadAction<string>): PreferencesSliceState => ({
      ...state,
      boardStyle: action.payload,
    }),

    pieceSetChosen: (state, action: PayloadAction<string>): PreferencesSliceState => ({
      ...state,
      pieceSet: action.payload,
    }),

    movableHighlightChosen: (state, action: PayloadAction<MovableHighlightName>): PreferencesSliceState => ({
      ...state,
      movableHighlight: action.payload,
    }),

    bikjangHintChosen: (state, action: PayloadAction<BikjangHintName>): PreferencesSliceState => ({
      ...state,
      bikjangHint: action.payload,
    }),

    effectsChosen: (state, action: PayloadAction<EffectsName>): PreferencesSliceState => ({
      ...state,
      effects: action.payload,
    }),

    soundEffectsVolumeChanged: (state, action: PayloadAction<Volume>): PreferencesSliceState => ({
      ...state,
      soundEffectsVolume: action.payload,
    }),

    musicVolumeChanged: (state, action: PayloadAction<Volume>): PreferencesSliceState => ({
      ...state,
      musicVolume: action.payload,
    }),

    sheetOpacityChanged: (state, action: PayloadAction<Opacity>): PreferencesSliceState => ({
      ...state,
      sheetOpacity: action.payload,
    }),
  },
});

export const {
  boardStyleChosen,
  pieceSetChosen,
  movableHighlightChosen,
  bikjangHintChosen,
  effectsChosen,
  soundEffectsVolumeChanged,
  musicVolumeChanged,
  sheetOpacityChanged,
} = preferencesSlice.actions;

export const preferencesReducer = preferencesSlice.reducer;
