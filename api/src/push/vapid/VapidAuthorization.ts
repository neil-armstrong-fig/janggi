import {base64UrlOfBytes, bytesOfBase64Url} from "@src/push/encrypting/base64url/Base64Url";

const TOKEN_LIFETIME_SECONDS = 12 * 3600;
const encoder = new TextEncoder();

/**
 * The `Authorization` header that tells a push service which application server is sending (RFC 8292): a short-lived ES256 token
 * naming the service's own origin and a way to reach the sender, with the public key it can be checked against. The keys are the
 * unpadded base64url a generator prints — the raw private scalar and the uncompressed public point — so a person can paste them
 * into a secret as they are.
 */
export async function vapidAuthorization(options: {
  readonly endpoint: string;
  readonly subject: string;
  readonly publicKey: string;
  readonly privateKey: string;
  readonly now: Date;
}): Promise<string> {
  const {endpoint, subject, publicKey, privateKey, now} = options;
  const publicBytes = bytesOfBase64Url(publicKey);

  const signingKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      d: privateKey,
      x: base64UrlOfBytes(publicBytes.slice(1, 33)),
      y: base64UrlOfBytes(publicBytes.slice(33)),
    },
    {name: "ECDSA", namedCurve: "P-256"},
    false,
    ["sign"],
  );

  const header = base64UrlOfText(JSON.stringify({typ: "JWT", alg: "ES256"}));
  const claims = base64UrlOfText(
    JSON.stringify({
      aud: new URL(endpoint).origin,
      exp: Math.floor(now.getTime() / 1000) + TOKEN_LIFETIME_SECONDS,
      sub: subject,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signature = await crypto.subtle.sign({name: "ECDSA", hash: "SHA-256"}, signingKey, encoder.encode(unsigned));

  return `vapid t=${unsigned}.${base64UrlOfBytes(new Uint8Array(signature))}, k=${publicKey}`;
}

function base64UrlOfText(text: string): string {
  return base64UrlOfBytes(encoder.encode(text));
}
