/** The bytes of unpadded base64url text, as a browser asks for a push server's public key. */
export function keyBytes(text: string): Uint8Array<ArrayBuffer> {
  const standard = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(standard.padEnd(Math.ceil(standard.length / 4) * 4, "="));

  return Uint8Array.from(binary, character => character.charCodeAt(0));
}
