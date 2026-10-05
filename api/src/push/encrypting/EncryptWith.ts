import type {EncryptionInputs} from "@src/push/encrypting/types/EncryptionInputs";

const RECORD_SIZE = 4096;
const encoder = new TextEncoder();

/**
 * A push message body as RFC 8291's `aes128gcm` makes it: a header of the salt, the record size and the sender's public key, then
 * the message — one record, ended with the delimiter byte `0x02` — encrypted with a key and nonce that come from the sender's
 * and the device's keys and the device's authentication secret. Split from `encryptPushBody` so the RFC's own example, whose
 * "random" values are fixed, can be run through it.
 */
export async function encryptWith(inputs: EncryptionInputs): Promise<Uint8Array> {
  const {plaintext, deviceKey, authSecret, serverPrivateKey, serverPublicKey, salt} = inputs;

  const devicePublicKey = await crypto.subtle.importKey(
    "raw",
    deviceKey,
    {name: "ECDH", namedCurve: "P-256"},
    false,
    [],
  );
  const shared = await crypto.subtle.deriveBits(ecdhWith(devicePublicKey), serverPrivateKey, 256);

  const keyInfo = joined(encoder.encode("WebPush: info\0"), deviceKey, serverPublicKey);
  const inputKeyingMaterial = await derived(new Uint8Array(shared), authSecret, keyInfo, 256);

  const contentKey = await derived(inputKeyingMaterial, salt, encoder.encode("Content-Encoding: aes128gcm\0"), 128);
  const nonce = await derived(inputKeyingMaterial, salt, encoder.encode("Content-Encoding: nonce\0"), 96);

  const key = await crypto.subtle.importKey("raw", contentKey, "AES-GCM", false, ["encrypt"]);
  const record = joined(plaintext, Uint8Array.of(2));
  const encrypted = await crypto.subtle.encrypt({name: "AES-GCM", iv: nonce}, key, record);

  const header = joined(salt, recordSizeBytes(), Uint8Array.of(serverPublicKey.length), serverPublicKey);

  return joined(header, new Uint8Array(encrypted));
}

/** The ECDH parameters, with the key under the name the platform reads (`public`); Workers' types spell it `$public`, as it is a keyword there. */
function ecdhWith(publicKey: CryptoKey): SubtleCryptoDeriveKeyAlgorithm {
  return {name: "ECDH", public: publicKey} as unknown as SubtleCryptoDeriveKeyAlgorithm;
}

/** HKDF (extract with `salt`, then expand with `info`) of `secret`, to `bits` bits. */
async function derived(secret: Uint8Array, salt: Uint8Array, info: Uint8Array, bits: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveBits"]);

  return new Uint8Array(await crypto.subtle.deriveBits({name: "HKDF", hash: "SHA-256", salt, info}, key, bits));
}

function recordSizeBytes(): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, RECORD_SIZE);

  return bytes;
}

function joined(...parts: Uint8Array[]): Uint8Array {
  const whole = new Uint8Array(parts.reduce((length, part) => length + part.length, 0));
  let offset = 0;

  for (const part of parts) {
    whole.set(part, offset);
    offset += part.length;
  }

  return whole;
}
