import type {Messages} from "@src/language/messages/Messages";
import {ENGLISH_ANNOUNCEMENT_MESSAGES} from "@src/language/status/announcement-messages/english/EnglishAnnouncementMessages";
import {ENGLISH_CLOCK_MESSAGES} from "@src/language/clock/clock-messages/english/EnglishClockMessages";
import {ENGLISH_CONTROL_MESSAGES} from "@src/language/status/control-messages/english/EnglishControlMessages";
import {ENGLISH_FRIEND_MESSAGES} from "@src/language/friend/friend-messages/english/EnglishFriendMessages";
import {ENGLISH_LANGUAGE_MESSAGES} from "@src/language/settings/you/language-messages/english/EnglishLanguageMessages";
import {ENGLISH_LOOK_MESSAGES} from "@src/language/settings/look-messages/english/EnglishLookMessages";
import {ENGLISH_OVERLAY_MESSAGES} from "@src/language/status/overlay-messages/english/EnglishOverlayMessages";
import {ENGLISH_PLAQUE_MESSAGES} from "@src/language/status/plaque-messages/english/EnglishPlaqueMessages";
import {ENGLISH_PLAY_MESSAGES} from "@src/language/settings/play-messages/english/EnglishPlayMessages";
import {ENGLISH_RECORD_MESSAGES} from "@src/language/record/record-messages/english/EnglishRecordMessages";
import {ENGLISH_RESULT_MESSAGES} from "@src/language/status/result-messages/english/EnglishResultMessages";
import {ENGLISH_RESUME_MESSAGES} from "@src/language/clock/resume-messages/english/EnglishResumeMessages";
import {ENGLISH_SETTINGS_MESSAGES} from "@src/language/settings/settings-messages/english/EnglishSettingsMessages";
import {ENGLISH_SOUND_MESSAGES} from "@src/language/settings/sound-messages/english/EnglishSoundMessages";
import {ENGLISH_STYLE_MESSAGES} from "@src/language/styles/style-messages/english/EnglishStyleMessages";
import {ENGLISH_TUTORIAL_MESSAGES} from "@src/language/tutorial/tutorial-messages/english/EnglishTutorialMessages";
import {ENGLISH_SIDES} from "@src/language/sides/english/EnglishSides";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";
import {ENGLISH_TOUR_MESSAGES} from "@src/language/onboarding/tour-messages/english/EnglishTourMessages";
import {ENGLISH_TRANSLATION_NOTICE_MESSAGES} from "@src/language/settings/you/translation-notice-messages/english/EnglishTranslationNoticeMessages";
import {ENGLISH_UNLOCK_MESSAGES} from "@src/language/settings/unlock-messages/english/EnglishUnlockMessages";
import {ENGLISH_WELCOME_MESSAGES} from "@src/language/onboarding/welcome-messages/english/EnglishWelcomeMessages";
import {ENGLISH_YOU_MESSAGES} from "@src/language/settings/you/you-messages/english/EnglishYouMessages";

/** The game in English, which every other language is checked against and which a player is read to until they choose another. */
export const ENGLISH_MESSAGES: Messages = {
  locale: "en",
  heading: "Janggi: Korean Chess",
  tabs: {Play: "Play", Look: "Look", Sound: "Sound", You: "You"},
  controls: ENGLISH_CONTROL_MESSAGES,
  sides: ENGLISH_SIDES,
  announcements: ENGLISH_ANNOUNCEMENT_MESSAGES,
  result: ENGLISH_RESULT_MESSAGES,
  play: ENGLISH_PLAY_MESSAGES,
  clock: ENGLISH_CLOCK_MESSAGES,
  resume: ENGLISH_RESUME_MESSAGES,
  look: ENGLISH_LOOK_MESSAGES,
  sound: ENGLISH_SOUND_MESSAGES,
  record: ENGLISH_RECORD_MESSAGES,
  overlays: ENGLISH_OVERLAY_MESSAGES,
  plaque: ENGLISH_PLAQUE_MESSAGES,
  welcome: ENGLISH_WELCOME_MESSAGES,
  tour: ENGLISH_TOUR_MESSAGES,
  translationNotice: ENGLISH_TRANSLATION_NOTICE_MESSAGES,
  language: ENGLISH_LANGUAGE_MESSAGES,
  you: ENGLISH_YOU_MESSAGES,
  toasts: {
    signInToPlayAFriend: "Sign in to play a friend online.",
    invitationHeldByTheTutorial: "Your friend's invitation opens when you leave the tutorial",
  },
  tutorial: ENGLISH_TUTORIAL_MESSAGES,
  friend: ENGLISH_FRIEND_MESSAGES,
  settings: ENGLISH_SETTINGS_MESSAGES,
  unlocks: ENGLISH_UNLOCK_MESSAGES,
  release: {ready: "A new version is ready", refresh: "Refresh", later: "Later"},
  styles: ENGLISH_STYLE_MESSAGES,
  pieceName: ({side, type}) => `${englishSideName(side)} ${type}`,
};
