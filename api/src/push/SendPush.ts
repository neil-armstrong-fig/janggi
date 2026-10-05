import type {PushOutcome} from "@src/push/types/PushOutcome";

const SECONDS_A_DAY = 86_400;

/**
 * Hands one encrypted message to a push service, which holds it for the device. Says whether it was taken, whether the device is
 * gone for good (404 or 410: the app was uninstalled or the permission taken back, and the subscription is worth nothing), or
 * whether it failed in some way that may mend itself. Never throws: a notification is a courtesy and must not cost a game.
 *
 * A message is held for a day, and `Topic` makes a later one replace an earlier one the device has not yet received, so a phone
 * that was off while the opponent made two moves is told once.
 */
export async function sendPush(options: {
  readonly endpoint: string;
  readonly authorization: string;
  readonly body: Uint8Array;
}): Promise<PushOutcome> {
  try {
    const response = await fetch(options.endpoint, {
      method: "POST",
      headers: {
        Authorization: options.authorization,
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: String(SECONDS_A_DAY),
        Urgency: "high",
        Topic: "turn",
      },
      body: options.body,
    });

    if (response.status === 404 || response.status === 410) return "gone";
    if (response.ok) return "sent";

    return "failed";
  } catch {
    return "failed";
  }
}
