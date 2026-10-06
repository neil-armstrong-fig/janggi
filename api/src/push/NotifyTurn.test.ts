import {afterEach, beforeEach, vi} from "vitest";
import {base64UrlOfBytes} from "@src/push/encrypting/base64url/Base64Url";
import {notifyTurn} from "@src/push/NotifyTurn";
import {testDatabase} from "@src/database/testing/TestDatabase";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

// The shared public key is the app's real one, whose private half the Worker alone holds: a pair of the test's own takes its place.
const keys = vi.hoisted(() => ({privateKey: ""}));

vi.mock("@janggi/shared/janggi/online/VapidPublicKey", async () => {
  const pair = (await crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const jwk = (await crypto.subtle.exportKey("jwk", pair.privateKey)) as JsonWebKey;
  const {base64UrlOfBytes, bytesOfBase64Url} = await import("@src/push/encrypting/base64url/Base64Url");
  keys.privateKey = jwk.d ?? "";

  return {
    VAPID_PUBLIC_KEY: base64UrlOfBytes(
      new Uint8Array([4, ...bytesOfBase64Url(jwk.x ?? ""), ...bytesOfBase64Url(jwk.y ?? "")]),
    ),
  };
});

const NOTIFICATION = {accountId: "user-1", opponentName: "Kim Yu-sin"};
let fetched: {endpoint: string; headers: Headers}[];
let answers: Record<string, number>;

beforeEach(() => {
  workerEnvironment.VAPID_PRIVATE_KEY = keys.privateKey;
  workerEnvironment.VAPID_SUBJECT = "mailto:ops@example.com";

  fetched = [];
  answers = {};
  vi.stubGlobal("fetch", (endpoint: string, init: RequestInit) => {
    fetched.push({endpoint, headers: new Headers(init.headers)});

    return Promise.resolve(new Response(undefined, {status: answers[endpoint] ?? 201}));
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(workerEnvironment, "VAPID_PRIVATE_KEY");
  Reflect.deleteProperty(workerEnvironment, "VAPID_SUBJECT");
});

it("sends an encrypted, signed message to each device the player subscribed", async () => {
  await subscribe("https://push.example/phone");
  await subscribe("https://push.example/laptop");

  await notifyTurn(NOTIFICATION);

  expect(fetched.map(each => each.endpoint).sort()).toEqual([
    "https://push.example/laptop",
    "https://push.example/phone",
  ]);
  expect(fetched[0]?.headers.get("Authorization")).toMatch(/^vapid t=.+, k=.+$/);
  expect(fetched[0]?.headers.get("Content-Encoding")).toBe("aes128gcm");
});

it("sends nothing to devices of another account", async () => {
  await subscribe("https://push.example/phone", "user-2");

  await notifyTurn(NOTIFICATION);

  expect(fetched).toEqual([]);
});

it("forgets a device the push service says is gone, and keeps the others", async () => {
  await subscribe("https://push.example/dead");
  await subscribe("https://push.example/alive");
  answers["https://push.example/dead"] = 410;

  await notifyTurn(NOTIFICATION);

  expect((await testDatabase.pushSubscriptionsOf("user-1")).map(each => each.endpoint)).toEqual([
    "https://push.example/alive",
  ]);
});

it("keeps a device whose push failed in a way that may pass", async () => {
  await subscribe("https://push.example/phone");
  answers["https://push.example/phone"] = 503;

  await notifyTurn(NOTIFICATION);

  expect(await testDatabase.pushSubscriptionsOf("user-1")).toHaveLength(1);
});

it("does nothing at all without the VAPID keys", async () => {
  await subscribe("https://push.example/phone");
  Reflect.deleteProperty(workerEnvironment, "VAPID_PRIVATE_KEY");

  await notifyTurn(NOTIFICATION);

  expect(fetched).toEqual([]);
});

it("is not stopped by a push service that cannot be reached", async () => {
  await subscribe("https://push.example/phone");
  vi.stubGlobal("fetch", () => Promise.reject(new Error("offline")));

  await expect(notifyTurn(NOTIFICATION)).resolves.toBeUndefined();
});

async function subscribe(endpoint: string, userId = "user-1"): Promise<void> {
  // A real device's keys: the encryption refuses anything else.
  const pair = (await crypto.subtle.generateKey({name: "ECDH", namedCurve: "P-256"}, true, [
    "deriveBits",
  ])) as CryptoKeyPair;
  const raw = new Uint8Array((await crypto.subtle.exportKey("raw", pair.publicKey)) as ArrayBuffer);

  await testDatabase.savePushSubscription({
    userId,
    subscription: {
      endpoint,
      p256dh: base64UrlOfBytes(raw),
      auth: base64UrlOfBytes(crypto.getRandomValues(new Uint8Array(16))),
    },
    now: new Date(),
  });
}
