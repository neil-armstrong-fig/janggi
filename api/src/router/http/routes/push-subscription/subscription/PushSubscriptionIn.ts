import {isRecord} from "@src/json/IsRecord";
import type {PushSubscription} from "@src/database/types/PushSubscription";

const MAX_ENDPOINT_LENGTH = 1024;
const MAX_KEY_LENGTH = 128;
const BASE64_URL = /^[A-Za-z0-9_-]+$/;

/**
 * The subscription a browser's `PushSubscription.toJSON()` made — `{endpoint, keys: {p256dh, auth}}` — or undefined where the body
 * is anything else. The endpoint must be an `https:` address, since the Worker will send to it, and the keys the unpadded
 * base64url a browser writes them in.
 */
export function pushSubscriptionIn(body: unknown): PushSubscription | undefined {
  if (!isRecord(body)) return undefined;

  const {endpoint, keys} = body;
  if (typeof endpoint !== "string" || !isHttpsAddress(endpoint)) return undefined;
  if (!isRecord(keys) || !isKey(keys["p256dh"]) || !isKey(keys["auth"])) return undefined;

  return {endpoint, p256dh: keys["p256dh"], auth: keys["auth"]};
}

function isHttpsAddress(text: string): boolean {
  if (text.length > MAX_ENDPOINT_LENGTH) return false;

  try {
    return new URL(text).protocol === "https:";
  } catch {
    return false;
  }
}

function isKey(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_KEY_LENGTH && BASE64_URL.test(value);
}
