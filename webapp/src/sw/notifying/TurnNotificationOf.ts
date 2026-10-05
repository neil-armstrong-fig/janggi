import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {TURN_NOTIFICATION_WORDS} from "@src/language/notification/TurnNotificationWords";
import type {TurnNotification} from "@src/sw/notifying/types/TurnNotification";

/**
 * The notification for a push: "<name> has moved. It's your turn." (or its Korean) where the push names who played, and just "It's your turn." where it
 * does not — a message that could not be read still has to be shown, since a browser takes back a subscription that pushes without
 * showing anything. The push is the server's `{opponent}`, and read as untrusted all the same: only a short, plain name is shown.
 */
export function turnNotificationOf(pushed: string | undefined, language: LanguageName): TurnNotification {
  const opponent = opponentIn(pushed);
  const words = TURN_NOTIFICATION_WORDS[language];

  return {
    title: words.title,
    options: {
      body: opponent === undefined ? words.yourTurn : words.moved(opponent),
      tag: "turn",
      renotify: true,
      icon: "icon-192.png",
    },
  };
}

function opponentIn(pushed: string | undefined): string | undefined {
  if (pushed === undefined) return undefined;

  try {
    const message: unknown = JSON.parse(pushed);
    if (typeof message !== "object" || message === null || !("opponent" in message)) return undefined;

    const {opponent} = message;
    if (typeof opponent !== "string") return undefined;

    const name = opponent.trim();
    if (name === "" || name.length > 40) return undefined;

    return name;
  } catch {
    return undefined;
  }
}
