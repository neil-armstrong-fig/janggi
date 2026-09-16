import type {ShareKeyKind} from "./ShareKeyKind.js";

/**
 * Whatever `encodeKey` put into a key of `kind`, or undefined where the text is not one: another kind of
 * key, a key cut short, one far longer than anything the app writes, or one that is not JSON inside.
 * Whitespace around the key is forgiven, since copying and pasting picks it up.
 *
 * What comes back is `unknown`, for the reason what comes out of storage is: anybody may have written
 * it, so whoever reads it checks every field.
 */
export function decodeKey(kind: ShareKeyKind, text: string): unknown {
  const key = text.trim();
  const prefix = `janggi-${kind}:`;
  if (!key.startsWith(prefix) || key.length > LONGEST_KEYS[kind]) return undefined;

  const body = key.slice(prefix.length);
  if (!/^[A-Za-z0-9_-]+$/.test(body)) return undefined;

  try {
    const binary = atob(body.replaceAll("-", "+").replaceAll("_", "/"));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));

    return JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(bytes));
  } catch {
    return undefined;
  }
}

/**
 * Far past anything honest. One style is a few kilobytes; a save carries a player's every style, so it
 * is allowed more — but neither is let near what would stall the page decoding it.
 */
const LONGEST_KEYS: Record<ShareKeyKind, number> = {
  save: 1_000_000,
  board: 64_000,
  pieces: 64_000,
};
