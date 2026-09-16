import {EFFECTS_NAMES} from "@janggi/shared/janggi/settings/EffectsName";
import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {MOVABLE_HIGHLIGHT_NAMES} from "@janggi/shared/janggi/settings/MovableHighlightName";
import {PREFERENCES_STORAGE_KEY} from "@src/redux/preferences/storage/PreferencesStorageKey";
import type {PreferencesSliceState} from "@src/redux/preferences/types/PreferencesSliceState";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * The preferences kept on the device, each one checked on its own: a movable-piece mark the app does not
 * offer, or a volume off the slider, falls back to its default and leaves every other choice as the
 * player made it. Preferences are stored by name (webapp `AGENTS.md`), which is what makes each one
 * checkable against the list it comes from.
 *
 * The two styles are the exception, and only a name is asked of them: either may name one of the
 * player's own styles, which this layer has no list of. Whether a name has a style behind it to wear is
 * asked where it is worn, `preferencesFrom`, and a name that does not falls back to the default there.
 */
export function loadPreferences(storage: Pick<Storage, "getItem"> | undefined): PreferencesSliceState {
  const stored = readJson(storage, PREFERENCES_STORAGE_KEY);
  const defaults = defaultPreferences();
  if (!isObject(stored)) return defaults;

  const {boardStyle, pieceSet, movableHighlight, effects, soundEffectsVolume, musicVolume} = stored;

  return {
    boardStyle: isStyleName(boardStyle) ? boardStyle : defaults.boardStyle,
    pieceSet: isStyleName(pieceSet) ? pieceSet : defaults.pieceSet,
    movableHighlight: isAmong(MOVABLE_HIGHLIGHT_NAMES, movableHighlight) ? movableHighlight : defaults.movableHighlight,
    effects: isAmong(EFFECTS_NAMES, effects) ? effects : defaults.effects,
    soundEffectsVolume: isVolume(soundEffectsVolume) ? soundEffectsVolume : defaults.soundEffectsVolume,
    musicVolume: isVolume(musicVolume) ? musicVolume : defaults.musicVolume,
  };
}

function isStyleName(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

function isVolume(value: unknown): value is Volume {
  return isFiniteNumber(value) && value >= MUTED_VOLUME && value <= FULL_VOLUME;
}
