import type {SentenceWithTwoLinks} from "@src/language/types/guide/SentenceWithTwoLinks";
import type {YouNameMessages} from "@src/language/types/you/YouNameMessages";
import type {YouSyncMessages} from "@src/language/types/you/YouSyncMessages";
import type {YouTurnNotificationsMessages} from "@src/language/types/you/YouTurnNotificationsMessages";

/** The optional Google account: signing in and out, what is kept, the display name and being told it is your turn. */
export interface YouAccountMessages {
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
