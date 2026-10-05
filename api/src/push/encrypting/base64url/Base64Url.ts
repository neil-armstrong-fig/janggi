/** The bytes of unpadded base64url text, which is how a browser writes a subscription's keys. */
export function bytesOfBase64Url(text: string): Uint8Array<ArrayBuffer> {
  const standard = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(standard.padEnd(Math.ceil(standard.length / 4) * 4, "="));

  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

/** Unpadded base64url text for bytes, which is how a push service and a JWT both write them. */
export function base64UrlOfBytes(bytes: Uint8Array): string {
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join("");

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
