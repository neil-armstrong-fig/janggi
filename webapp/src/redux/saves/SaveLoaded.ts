import type {Save} from "@src/redux/saves/types/Save";
import {createAction} from "@reduxjs/toolkit";

/**
 * A save key loaded on this device. Each slice a save touches answers it for itself: the progress is
 * replaced by the save's, the player's own styles have the save's added to them, and a game not yet
 * begun, against a bot the loaded progress no longer reaches, is dealt again at a strength it does.
 */
export const saveLoaded = createAction<Save>("saves/loaded");
