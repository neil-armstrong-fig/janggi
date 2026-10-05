import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** What the "it's your turn" notification says in one language. */
interface TurnNotificationLanguage {
  readonly title: string;
  /** Where the push did not say who played. */
  readonly yourTurn: string;
  readonly moved: (opponent: string) => string;
}

/**
 * The words of the turn notification, apart from `Messages` because the service worker writes it and must not carry the whole
 * game's words to do so. A sentence is a function so each language orders it for itself.
 */
export const TURN_NOTIFICATION_WORDS: Record<LanguageName, TurnNotificationLanguage> = {
  en: {
    title: "Janggi",
    yourTurn: "It's your turn.",
    moved: opponent => `${opponent} has moved. It's your turn.`,
  },
  ko: {
    title: "장기",
    yourTurn: "당신의 차례입니다.",
    moved: opponent => `${opponent}님이 수를 두었습니다. 당신의 차례입니다.`,
  },
};
