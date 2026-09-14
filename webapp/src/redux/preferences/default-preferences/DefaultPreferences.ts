import {FULL_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";

/**
 * How the game looks and sounds before the player has chosen anything — what the slice starts from, and
 * what any preference kept on the device falls back to when it cannot be read.
 */
export function defaultPreferences(): PreferencesSliceState {
  return {
    boardStyle: "Classic",
    pieceSet: "Traditional",
    movableHighlight: "Shown",
    effects: "Full",
    soundEffectsVolume: FULL_VOLUME,
    musicVolume: FULL_VOLUME,
  };
}
