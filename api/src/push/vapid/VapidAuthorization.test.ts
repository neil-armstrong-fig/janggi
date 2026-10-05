import {base64UrlOfBytes, bytesOfBase64Url} from "@src/push/encrypting/base64url/Base64Url";
import {vapidAuthorization} from "@src/push/vapid/VapidAuthorization";

const NOW = new Date("2026-10-01T12:00:00Z");

it("signs a token naming the push service's origin, with the sender and an expiry under a day", async () => {
  const keys = await madeKeys();

  const header = await vapidAuthorization({
    endpoint: "https://push.example/some/long/path?x=1",
    subject: "mailto:ops@example.com",
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    now: NOW,
  });

  const [, token, key] = /^vapid t=(.+), k=(.+)$/.exec(header) ?? [];
  const [head, claims, signature] = (token ?? "").split(".");
  expect(key).toBe(keys.publicKey);
  expect(JSON.parse(text(head))).toEqual({typ: "JWT", alg: "ES256"});
  expect(JSON.parse(text(claims))).toEqual({
    aud: "https://push.example",
    exp: NOW.getTime() / 1000 + 12 * 3600,
    sub: "mailto:ops@example.com",
  });
  expect(await verified(keys.publicKey, `${head}.${claims}`, signature ?? "")).toBe(true);
});

it("makes a token that does not verify against any other key", async () => {
  const keys = await madeKeys();
  const other = await madeKeys();

  const header = await vapidAuthorization({
    endpoint: "https://push.example/x",
    subject: "mailto:ops@example.com",
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    now: NOW,
  });

  const [head, claims, signature] = (/t=(.+),/.exec(header)?.[1] ?? "").split(".");
  expect(await verified(other.publicKey, `${head}.${claims}`, signature ?? "")).toBe(false);
});

/** A key pair in the form a generator prints: raw private scalar and uncompressed public point, base64url. */
async function madeKeys(): Promise<{publicKey: string; privateKey: string}> {
  const pair = (await crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const jwk = (await crypto.subtle.exportKey("jwk", pair.privateKey)) as JsonWebKey;
  const point = new Uint8Array([4, ...bytesOfBase64Url(jwk.x ?? ""), ...bytesOfBase64Url(jwk.y ?? "")]);

  return {publicKey: base64UrlOfBytes(point), privateKey: jwk.d ?? ""};
}

async function verified(publicKey: string, signed: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    bytesOfBase64Url(publicKey),
    {name: "ECDSA", namedCurve: "P-256"},
    false,
    ["verify"],
  );

  return crypto.subtle.verify(
    {name: "ECDSA", hash: "SHA-256"},
    key,
    bytesOfBase64Url(signature),
    new TextEncoder().encode(signed),
  );
}

function text(part: string | undefined): string {
  return new TextDecoder().decode(bytesOfBase64Url(part ?? ""));
}
