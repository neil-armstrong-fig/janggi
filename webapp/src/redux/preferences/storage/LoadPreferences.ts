import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * The preferences kept on the device, each one checked on its own: a board style the app no longer
 * ships, or a volume off the slider, falls back to its default and leaves every other choice as the
 * player made it. Preferences are stored by name (webapp `AGENTS.md`), which is what makes each one
 * checkable against the list it comes from.
 */
export function loadPreferences(storage: Pick<Storage, "getItem"> | undefined): PreferencesSliceState {
  const stored = readJson(storage, PREFERENCES_STORAGE_KEY);
  const defaults = defaultPreferences();
  if (!isObject(stored)) return defaults;

  const {boardStyle, pieceSet, movableHighlight, effects, soundEffectsVolume, musicVolume} = stored;

  return {
    boardStyle: isAmong(BOARD_STYLE_NAMES, boardStyle) ? boardStyle : defaults.boardStyle,
    pieceSet: isAmong(PIECE_SET_NAMES, pieceSet) ? pieceSet : defaults.pieceSet,
    movableHighlight: isAmong(MOVABLE_HIGHLIGHT_NAMES, movableHighlight) ? movableHighlight : defaults.movableHighlight,
    effects: isAmong(EFFECTS_NAMES, effects) ? effects : defaults.effects,
    soundEffectsVolume: isVolume(soundEffectsVolume) ? soundEffectsVolume : defaults.soundEffectsVolume,
    musicVolume: isVolume(musicVolume) ? musicVolume : defaults.musicVolume,
  };
}

function isVolume(value: unknown): value is Volume {
  return isFiniteNumber(value) && value >= MUTED_VOLUME && value <= FULL_VOLUME;
}
