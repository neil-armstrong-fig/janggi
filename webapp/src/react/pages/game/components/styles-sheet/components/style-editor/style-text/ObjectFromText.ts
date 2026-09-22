import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import type {Unchecked} from "@src/redux/untrusted/types/Unchecked";
import {isObject} from "@src/redux/untrusted/IsObject";

/**
 * The one JSON object a player has written a style as, or what is wrong with the text — the first check
 * either a style being saved or a style being read back in the raw view passes.
 */
export function objectFromText(text: string): Checked<Unchecked> {
  let written: unknown;

  try {
    written = JSON.parse(text);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);

    return {kind: "refused", reason: `The style is not JSON a browser can read: ${detail}`};
  }

  if (!isObject(written)) return {kind: "refused", reason: "The style should be one JSON object, in braces."};

  return {kind: "accepted", value: written};
}
