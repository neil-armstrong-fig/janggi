import {base64UrlOfBytes, bytesOfBase64Url} from "@src/push/encrypting/base64url/Base64Url";
import {encryptWith} from "@src/push/encrypting/EncryptWith";
import {encryptPushBody} from "@src/push/encrypting/EncryptPushBody";

// RFC 8291, section 5 and appendix A: the one worked example of this encryption, with its random values fixed.
const AS_PRIVATE = "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw";
const AS_PUBLIC = "BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8";
const UA_PUBLIC = "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4";
const UA_PRIVATE = "q1dXpw3UpT5VOmu_cf_v6ih07Aems3njxI-JWgLcM94";
const AUTH_SECRET = "BTBZMqHH6r4Tts7J_aSIgg";
const SALT = "DGv6ra1nlYgDCS1FRnbzlw";
// The RFC prints the 86-byte header and the ciphertext separately; base64 of the two cannot simply be joined.
const EXPECTED_HEADER =
  "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8";
const EXPECTED_CIPHERTEXT = "8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ";

it("makes the body RFC 8291 gives for its example", async () => {
  const publicKey = bytesOfBase64Url(AS_PUBLIC);
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      d: AS_PRIVATE,
      x: base64UrlOfBytes(publicKey.slice(1, 33)),
      y: base64UrlOfBytes(publicKey.slice(33)),
    },
    {name: "ECDH", namedCurve: "P-256"},
    false,
    ["deriveBits"],
  );

  const body = await encryptWith({
    plaintext: new TextEncoder().encode("When I grow up, I want to be a watermelon"),
    deviceKey: bytesOfBase64Url(UA_PUBLIC),
    authSecret: bytesOfBase64Url(AUTH_SECRET),
    serverPrivateKey: privateKey,
    serverPublicKey: publicKey,
    salt: bytesOfBase64Url(SALT),
  });

  expect([...body]).toEqual([...bytesOfBase64Url(EXPECTED_HEADER), ...bytesOfBase64Url(EXPECTED_CIPHERTEXT)]);
});

it("makes a body only the device it was for can read, with a key and salt of its own each time", async () => {
  const keys = {p256dh: UA_PUBLIC, auth: AUTH_SECRET};

  const first = await encryptPushBody("Kim has moved", keys);
  const second = await encryptPushBody("Kim has moved", keys);

  expect(first).toBeDefined();
  expect(base64UrlOfBytes(first ?? new Uint8Array())).not.toBe(base64UrlOfBytes(second ?? new Uint8Array()));
  expect(await decrypted(first ?? new Uint8Array())).toBe("Kim has moved");
});

it("makes no body for keys a device could not have made", async () => {
  expect(await encryptPushBody("hi", {p256dh: "short", auth: AUTH_SECRET})).toBeUndefined();
  expect(await encryptPushBody("hi", {p256dh: UA_PUBLIC, auth: "short"})).toBeUndefined();
});

/** What the device does: reads the header, derives the same key from its own private key, and decrypts. */
async function decrypted(body: Uint8Array): Promise<string> {
  const salt = body.slice(0, 16);
  const serverPublic = body.slice(21, 21 + body[20]!);
  const devicePublic = bytesOfBase64Url(UA_PUBLIC);
  const authSecret = bytesOfBase64Url(AUTH_SECRET);
  const encoder = new TextEncoder();

  const privateKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      d: UA_PRIVATE,
      x: base64UrlOfBytes(devicePublic.slice(1, 33)),
      y: base64UrlOfBytes(devicePublic.slice(33)),
    },
    {name: "ECDH", namedCurve: "P-256"},
    false,
    ["deriveBits"],
  );
  const serverKey = await crypto.subtle.importKey("raw", serverPublic, {name: "ECDH", namedCurve: "P-256"}, false, []);
  const shared = await crypto.subtle.deriveBits(
    {name: "ECDH", public: serverKey} as unknown as SubtleCryptoDeriveKeyAlgorithm,
    privateKey,
    256,
  );

  const hkdf = async (
    secret: ArrayBuffer | Uint8Array,
    hkdfSalt: Uint8Array,
    info: Uint8Array,
    bits: number,
  ): Promise<ArrayBuffer> => {
    const key = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveBits"]);

    return crypto.subtle.deriveBits({name: "HKDF", hash: "SHA-256", salt: hkdfSalt, info}, key, bits);
  };
  const info = new Uint8Array([...encoder.encode("WebPush: info\0"), ...devicePublic, ...serverPublic]);
  const ikm = await hkdf(shared, authSecret, info, 256);
  const cek = await hkdf(ikm, salt, encoder.encode("Content-Encoding: aes128gcm\0"), 128);
  const nonce = await hkdf(ikm, salt, encoder.encode("Content-Encoding: nonce\0"), 96);

  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const record = new Uint8Array(
    await crypto.subtle.decrypt({name: "AES-GCM", iv: nonce}, key, body.slice(21 + serverPublic.length)),
  );

  return new TextDecoder().decode(record.slice(0, record.length - 1));
}
