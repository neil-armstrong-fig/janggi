import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {isRecord} from "@src/json/IsRecord";
import {parseLook} from "@src/room/answering/parsing/parts/ParseLook";

/**
 * An `Introduction` from whatever arrived, or undefined. The name is cleaned the way a player's own is; the keys are only
 * checked for being text of a sane length here, since decoding them is the receiving webapp's job, and it reads them as
 * untrusted.
 */
export function parseIntroduction(value: unknown): Introduction | undefined {
  if (!isRecord(value) || typeof value["displayName"] !== "string") return undefined;

  const displayName = cleanedDisplayName(value["displayName"]);
  const look = parseLook(value);
  if (displayName === undefined || look === undefined) return undefined;

  return {displayName, ...look};
}
