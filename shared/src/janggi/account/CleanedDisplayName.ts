import {DISPLAY_NAME_MAX_LENGTH} from "@janggi/shared/janggi/account/DisplayNameLimits";

/**
 * The display name a player typed, tidied — or undefined where it cannot be one.
 *
 * Tidied is trimmed, with each run of spaces and tabs inside it made one space. A name may be whatever the player
 * likes within that — any letters, in any script, and punctuation — but not empty, not longer than
 * `DISPLAY_NAME_MAX_LENGTH` characters (counted as a person counts them, not as UTF-16 does), and not holding a
 * line break or any other control or invisible formatting character — a line break would break whatever later draws it on a line of its own, and a zero-width space would let a name look blank.
 *
 * Both the webapp and the API run it, and the API runs it on whatever arrives, so it is the one definition of what
 * a name is.
 */
export function cleanedDisplayName(typed: string): string | undefined {
  if (/\p{C}/u.test(typed.replace(/[\t ]/g, " "))) return undefined;

  const tidied = typed.trim().replace(/[\t ]+/g, " ");
  const length = [...tidied].length;
  if (length >= 1 && length <= DISPLAY_NAME_MAX_LENGTH) {
    return tidied;
  }

  return undefined;
}
