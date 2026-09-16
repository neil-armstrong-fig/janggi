import type {ShareKeyKind} from "./ShareKeyKind.js";

/**
 * A value as a key a player can copy out of the app and paste into another copy of it: the kind of
 * thing it is, then the value as JSON in base64url, so the key is one unbroken run of characters that
 * survives a chat message. The JSON is UTF-8 first, because a piece set's characters are hangul and
 * hanja, which `btoa` alone will not take.
 *
 * **Neither encrypted nor signed, on purpose.** There is no server to check a signature against, and a
 * player who decodes their save and hands themselves more XP has found one of the ways the game means
 * to be played.
 *
 * **Here rather than in the webapp because it is a wire format, not a behaviour.** The app writes keys
 * with it and the acceptance tests build keys with it; two copies of a format are two chances for one
 * to drift from the other, and a spec that pasted a key the app could no longer read would be testing
 * nothing. Written only with what a browser and Node both have — no `Buffer`.
 */
export function encodeKey(kind: ShareKeyKind, value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join("");
  const base64url = btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");

  return `janggi-${kind}:${base64url}`;
}
