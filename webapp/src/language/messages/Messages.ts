import type {AnnouncementMessages} from "@src/language/status/announcement-messages/AnnouncementMessages";
import type {ControlMessages} from "@src/language/status/control-messages/ControlMessages";
import type {FriendMessages} from "@src/language/friend/friend-messages/FriendMessages";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";
import type {ReleaseMessages} from "@src/language/messages/types/ReleaseMessages";
import type {SettingsMessages} from "@src/language/settings/settings-messages/SettingsMessages";
import type {UnlockMessages} from "@src/language/settings/unlock-messages/UnlockMessages";
import type {LookMessages} from "@src/language/settings/look-messages/LookMessages";
import type {OverlayMessages} from "@src/language/status/overlay-messages/OverlayMessages";
import type {LanguageMessages} from "@src/language/settings/you/language-messages/LanguageMessages";
import type {PlaqueMessages} from "@src/language/status/plaque-messages/PlaqueMessages";
import type {PlayMessages} from "@src/language/settings/play-messages/PlayMessages";
import type {StyleMessages} from "@src/language/styles/style-messages/StyleMessages";
import type {SoundMessages} from "@src/language/settings/sound-messages/SoundMessages";
import type {TourMessages} from "@src/language/onboarding/tour-messages/TourMessages";
import type {TutorialMessages} from "@src/language/tutorial/tutorial-messages/TutorialMessages";
import type {YouMessages} from "@src/language/settings/you/you-messages/YouMessages";
import type {ClockMessages} from "@src/language/clock/clock-messages/ClockMessages";
import type {ResumeMessages} from "@src/language/clock/resume-messages/ResumeMessages";
import type {TranslationNoticeMessages} from "@src/language/settings/you/translation-notice-messages/TranslationNoticeMessages";
import type {WelcomeMessages} from "@src/language/onboarding/welcome-messages/WelcomeMessages";
import type {RecordMessages} from "@src/language/record/record-messages/RecordMessages";
import type {ResultMessages} from "@src/language/status/result-messages/ResultMessages";
import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Every word of the game a player has to read to play it, in one language (`docs/localisation.md`). A language is a value of
 * this type, so one that leaves a message out does not compile.
 *
 * Whatever a word stands for keeps its English id in the code — `SettingsTabName`, `Side`, `DrawnBy` — and
 * is looked up here for what a player reads. Where a sentence is built from a part, it is a function, so each language
 * can order and inflect it as it needs to rather than have a part spliced into English word order.
 */
export interface Messages {
  /** The locale numbers are written in, so a thousand reads as the language writes it. */
  readonly locale: string;
  /** The page's main heading, which only a screen reader or a search engine reads. */
  readonly heading: string;
  /** What each settings tab says, on its face and to a screen reader. */
  readonly tabs: Record<SettingsTabName, string>;
  readonly controls: ControlMessages;
  /** What an army is called. */
  readonly sides: Record<Side, string>;
  readonly announcements: AnnouncementMessages;
  readonly result: ResultMessages;
  readonly play: PlayMessages;
  readonly clock: ClockMessages;
  readonly resume: ResumeMessages;
  readonly look: LookMessages;
  readonly sound: SoundMessages;
  readonly record: RecordMessages;
  readonly overlays: OverlayMessages;
  readonly plaque: PlaqueMessages;
  readonly welcome: WelcomeMessages;
  readonly tour: TourMessages;
  readonly tutorial: TutorialMessages;
  readonly translationNotice: TranslationNoticeMessages;
  readonly language: LanguageMessages;
  readonly you: YouMessages;
  readonly toasts: ToastMessages;
  readonly friend: FriendMessages;
  readonly settings: SettingsMessages;
  readonly unlocks: UnlockMessages;
  readonly release: ReleaseMessages;
  readonly styles: StyleMessages;
  /** What a piece is called out loud, which is what a screen reader reads whichever set is being worn. */
  readonly pieceName: (piece: Piece) => string;
}

/** The brief messages the game puts over the page, which leave by themselves. */
interface ToastMessages {
  /** Said when Online is chosen with nobody signed in, as the account card it sends them to is shown. */
  readonly signInToPlayAFriend: string;
  /** Said when a friend's invitation is opened while the tutorial has the board, which holds it until it is left. */
  readonly invitationHeldByTheTutorial: string;
}
