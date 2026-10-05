import type {AnnouncementMessages} from "@src/language/types/AnnouncementMessages";
import type {ControlMessages} from "@src/language/types/ControlMessages";
import type {LookMessages} from "@src/language/types/LookMessages";
import type {OverlayMessages} from "@src/language/types/OverlayMessages";
import type {LanguageMessages} from "@src/language/types/LanguageMessages";
import type {PlaqueMessages} from "@src/language/types/PlaqueMessages";
import type {PlayMessages} from "@src/language/types/PlayMessages";
import type {SoundMessages} from "@src/language/types/SoundMessages";
import type {TourMessages} from "@src/language/types/TourMessages";
import type {TranslationNoticeMessages} from "@src/language/types/TranslationNoticeMessages";
import type {WelcomeMessages} from "@src/language/types/WelcomeMessages";
import type {RecordMessages} from "@src/language/types/RecordMessages";
import type {ResultMessages} from "@src/language/types/ResultMessages";
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
  /** What each settings tab says, on its face and to a screen reader. */
  readonly tabs: Record<SettingsTabName, string>;
  readonly controls: ControlMessages;
  /** What an army is called. */
  readonly sides: Record<Side, string>;
  readonly announcements: AnnouncementMessages;
  readonly result: ResultMessages;
  readonly play: PlayMessages;
  readonly look: LookMessages;
  readonly sound: SoundMessages;
  readonly record: RecordMessages;
  readonly overlays: OverlayMessages;
  readonly plaque: PlaqueMessages;
  readonly welcome: WelcomeMessages;
  readonly tour: TourMessages;
  readonly translationNotice: TranslationNoticeMessages;
  readonly language: LanguageMessages;
}
