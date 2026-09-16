import {LATEST_SAVE_VERSION} from "@janggi/shared/janggi/progress/SaveKeyJson";
import type {Save} from "@src/redux/saves/types/Save";
import {customStylesFrom} from "@src/redux/custom-styles/custom-styles-from/CustomStylesFrom";
import {decodeKey} from "@janggi/shared/janggi/share-keys/DecodeKey";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";
import {progressFrom} from "@src/redux/progress/progress-from/ProgressFrom";

/**
 * The save in the text a player has pasted, or undefined where it is not a save key.
 *
 * Read field by field against `SaveKeyJson`, the shape `SaveBuilder` writes — and read **generously**,
 * because a player hand-editing a key is a thing this game invites rather than tolerates:
 *
 * - **The version may be missing**, since somebody writing a key from scratch will leave it off. What it
 *   may not be is another version's number: that is a save this app would misread rather than one it can
 *   take.
 * - **The XP must be there and be an amount of XP.** Loading replaces the player's progress, so a key must
 *   at least say what it is replacing it with — where a stored progress with a broken number would only
 *   start that number again.
 * - Past that, every field is checked and kept as narrowly as it fails: any amount of XP stands, a ladder
 *   that makes no sense starts at the bottom, and one style that does not check out leaves the rest.
 */
export function saveFrom(text: string): Save | undefined {
  const written = decodeKey("save", text);
  if (!isObject(written) || !isThisVersion(written["v"])) return undefined;
  if (!isFiniteNumber(written["xp"]) || written["xp"] < 0) return undefined;

  const progress = progressFrom(written);
  if (!progress) return undefined;

  return {progress, customStyles: customStylesFrom(written["customStyles"])};
}

function isThisVersion(version: unknown): boolean {
  return version === undefined || version === LATEST_SAVE_VERSION;
}
