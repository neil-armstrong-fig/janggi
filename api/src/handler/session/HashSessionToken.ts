/**
 * The hex SHA-256 of a session token — what the database keeps in its place, so a leaked table cannot be replayed as
 * cookies. A fast hash is right here where a password's would not be: the token is 256 bits of randomness, with nothing
 * to guess.
 */
export async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));

  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}
