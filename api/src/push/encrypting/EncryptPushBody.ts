import {bytesOfBase64Url} from "@src/push/encrypting/base64url/Base64Url";
import {encryptWith} from "@src/push/encrypting/EncryptWith";
import type {PushKeys} from "@src/push/encrypting/types/PushKeys";

const AUTH_SECRET_LENGTH = 16;
const SALT_LENGTH = 16;

/**
 * The body of a push message to one device, encrypted so that only that device can read it: the push service that carries it
 * sees nothing. A new key pair and salt are made for every message. Undefined where the device's keys are not ones that can be
 * used (a stored key that is damaged must cost one device its notification, not the game).
 */
export async function encryptPushBody(message: string, keys: PushKeys): Promise<Uint8Array | undefined> {
  try {
    const deviceKey = bytesOfBase64Url(keys.p256dh);
    const authSecret = bytesOfBase64Url(keys.auth);
    if (deviceKey.length !== 65 || authSecret.length !== AUTH_SECRET_LENGTH) return undefined;

    const pair = (await crypto.subtle.generateKey({name: "ECDH", namedCurve: "P-256"}, true, [
      "deriveBits",
    ])) as CryptoKeyPair;

    return await encryptWith({
      plaintext: new TextEncoder().encode(message),
      deviceKey,
      authSecret,
      serverPrivateKey: pair.privateKey,
      serverPublicKey: new Uint8Array((await crypto.subtle.exportKey("raw", pair.publicKey)) as ArrayBuffer),
      salt: crypto.getRandomValues(new Uint8Array(SALT_LENGTH)),
    });
  } catch {
    return undefined;
  }
}
