import type {YouSaveTransferMessages} from "@src/language/settings/you/you-messages/types/YouSaveTransferMessages";
import type {SentenceWithTwoLinks} from "@src/language/types/SentenceWithTwoLinks";
import type {YouSyncMessages} from "@src/language/settings/you/you-messages/types/YouSyncMessages";

/** Everything on the You tab but the language picker, which `LanguageMessages` has. */
export interface YouMessages {
  readonly progress: YouProgressMessages;
  readonly account: YouAccountMessages;
  readonly links: YouLinksMessages;
  readonly version: string;
  readonly saveTransfer: YouSaveTransferMessages;
  readonly keys: YouKeyMessages;
}

/** The optional Google account: signing in and out, what is kept, the display name and being told it is your turn. */
interface YouAccountMessages {
  readonly label: string;
  readonly heading: string;
  readonly signedOutIntro: string;
  readonly whatIsKept: string;
  readonly signIn: string;
  readonly signingIn: string;
  readonly signedInWith: string;
  readonly sync: YouSyncMessages;
  readonly signOut: string;
  readonly deleteAccount: string;
  readonly deleteWhatTheServerHolds: string;
  /** What signing in means for the terms and the privacy policy, linking the two. */
  readonly legal: SentenceWithTwoLinks;
  readonly name: YouNameMessages;
  readonly turnNotifications: YouTurnNotificationsMessages;
}

/** The key a player copies to share, and what is said once they have. Used for saves and, in the styles sheet, styles. */
interface YouKeyMessages {
  readonly keyLabel: string;
  readonly copied: string;
  readonly selectToCopy: string;
}

/** The app and help links in the You tab. The developer's website needs no note: its address is its note. */
interface YouLinksMessages {
  readonly heading: string;
  readonly install: string;
  readonly guide: YouLinkMessages;
  readonly replayTour: YouLinkMessages;
  readonly references: YouLinkMessages;
  readonly developerWebsite: string;
  readonly repository: YouLinkMessages;
}

/** One of the links under App & help: what it is called, and the short note beside it. */
interface YouLinkMessages {
  readonly title: string;
  readonly note: string;
}

/** Changing the display name: the form, and the answer to what was tried. */
interface YouNameMessages {
  readonly label: string;
  readonly placeholder: string;
  readonly save: string;
  /** Said of a name that cannot be one, given the longest a name may be. */
  readonly badLength: (longest: number) => string;
  readonly notAllowed: string;
  readonly couldNotChange: string;
  readonly changed: string;
}

/** The player's XP, how it is earned, and what it opens next. */
interface YouProgressMessages {
  /** The XP as a heading, given the amount already written out for the language. */
  readonly xp: (amount: string) => string;
  readonly explainLabel: string;
  readonly explanation: string;
  /** What is next to unlock, given its price written out for the language and what it opens, already joined. */
  readonly nextUnlock: (xp: string, unlocks: string) => string;
  readonly allUnlocked: string;
  readonly barLabel: string;
}

/** The switch that has the device tell the player when a friend has moved and it is their turn. */
interface YouTurnNotificationsMessages {
  readonly label: string;
  readonly on: string;
  readonly off: string;
  /** Said where the player has blocked notifications in the browser, which only they can undo. */
  readonly blocked: string;
}
