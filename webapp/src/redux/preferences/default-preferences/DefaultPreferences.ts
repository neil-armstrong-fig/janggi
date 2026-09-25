import {DEFAULT_OPACITY} from "@janggi/shared/janggi/settings/Opacity";
import {FULL_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";

/**
 * How the game looks and sounds before the player has chosen anything — what the slice starts from, and
 * what any preference kept on the device falls back to when it cannot be read.
 */
export function defaultPreferences(): PreferencesSliceState {
  return {
    boardStyle: "Classic",
    hanBoardStyle: undefined,
    pieceSet: "Modern",
    hanPieceSet: undefined,
    movableHighlight: "Shown",
    bikjangHint: "Shown",
    flipBoardForHan: false,
    effects: "Full",
    soundEffectsVolume: FULL_VOLUME,
    musicVolume: FULL_VOLUME,
    sheetOpacity: DEFAULT_OPACITY,
  };
}
