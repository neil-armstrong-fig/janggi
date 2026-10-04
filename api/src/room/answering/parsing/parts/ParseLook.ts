import type {Look} from "@janggi/shared/janggi/online/messages/Look";
import {isRecord} from "@src/json/IsRecord";

/** The longest board-style or piece-set key a player may show: what the webapp's `decodeKey` will read, so a longer one could only be thrown away at the other end. */
const MAX_KEY_LENGTH = 64_000;

/**
 * A `Look` from whatever arrived, or undefined. The keys are only checked for being text of a sane length here, since
 * decoding them is the receiving webapp's job, and it reads them as untrusted.
 */
export function parseLook(value: unknown): Look | undefined {
  if (!isRecord(value)) return undefined;

  const boardKey = value["boardKey"];
  const piecesKey = value["piecesKey"];
  if (!isOptionalKey(boardKey) || !isOptionalKey(piecesKey)) return undefined;

  if (boardKey !== undefined && piecesKey !== undefined) return {boardKey, piecesKey};
  if (boardKey !== undefined) return {boardKey};
  if (piecesKey !== undefined) return {piecesKey};

  return {};
}

function isOptionalKey(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === "string" && value.length <= MAX_KEY_LENGTH);
}
