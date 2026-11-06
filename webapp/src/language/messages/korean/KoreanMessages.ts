import type {Messages} from "@src/language/messages/Messages";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {KOREAN_TUTORIAL_MESSAGES} from "@src/language/tutorial/tutorial-messages/korean/KoreanTutorialMessages";
import {KOREAN_ANNOUNCEMENT_MESSAGES} from "@src/language/status/announcement-messages/korean/KoreanAnnouncementMessages";
import {KOREAN_CLOCK_MESSAGES} from "@src/language/clock/clock-messages/korean/KoreanClockMessages";
import {KOREAN_CONTROL_MESSAGES} from "@src/language/status/control-messages/korean/KoreanControlMessages";
import {KOREAN_FRIEND_MESSAGES} from "@src/language/friend/friend-messages/korean/KoreanFriendMessages";
import {KOREAN_LANGUAGE_MESSAGES} from "@src/language/settings/you/language-messages/korean/KoreanLanguageMessages";
import {KOREAN_LOOK_MESSAGES} from "@src/language/settings/look-messages/korean/KoreanLookMessages";
import {KOREAN_OVERLAY_MESSAGES} from "@src/language/status/overlay-messages/korean/KoreanOverlayMessages";
import {KOREAN_PLAQUE_MESSAGES} from "@src/language/status/plaque-messages/korean/KoreanPlaqueMessages";
import {KOREAN_PLAY_MESSAGES} from "@src/language/settings/play-messages/korean/KoreanPlayMessages";
import {KOREAN_RECORD_MESSAGES} from "@src/language/record/record-messages/korean/KoreanRecordMessages";
import {KOREAN_RESULT_MESSAGES} from "@src/language/status/result-messages/korean/KoreanResultMessages";
import {KOREAN_RESUME_MESSAGES} from "@src/language/clock/resume-messages/korean/KoreanResumeMessages";
import {KOREAN_SETTINGS_MESSAGES} from "@src/language/settings/settings-messages/korean/KoreanSettingsMessages";
import {KOREAN_SOUND_MESSAGES} from "@src/language/settings/sound-messages/korean/KoreanSoundMessages";
import {KOREAN_STYLE_MESSAGES} from "@src/language/styles/style-messages/korean/KoreanStyleMessages";
import {KOREAN_SIDES} from "@src/language/sides/korean/KoreanSides";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";
import {KOREAN_TOUR_MESSAGES} from "@src/language/onboarding/tour-messages/korean/KoreanTourMessages";
import {KOREAN_TRANSLATION_NOTICE_MESSAGES} from "@src/language/settings/you/translation-notice-messages/korean/KoreanTranslationNoticeMessages";
import {KOREAN_UNLOCK_MESSAGES} from "@src/language/settings/unlock-messages/korean/KoreanUnlockMessages";
import {KOREAN_WELCOME_MESSAGES} from "@src/language/onboarding/welcome-messages/korean/KoreanWelcomeMessages";
import {KOREAN_YOU_MESSAGES} from "@src/language/settings/you/you-messages/korean/KoreanYouMessages";

/**
 * The game in Korean, using janggi's own terms where it has them — 한수쉼, 빅장, 외통, 장군 — rather than a
 * translation of the English. The sentences avoid a particle after an army's name (초 승리, not 초가
 * 이겼습니다), which changes with the sound before it and is a mistake waiting for a name the code does
 * not know yet.
 */
export const KOREAN_MESSAGES: Messages = {
  locale: "ko",
  heading: "장기 온라인 게임",
  tabs: {Play: "게임", Look: "화면", Sound: "소리", You: "내 정보"},
  controls: KOREAN_CONTROL_MESSAGES,
  sides: KOREAN_SIDES,
  announcements: KOREAN_ANNOUNCEMENT_MESSAGES,
  result: KOREAN_RESULT_MESSAGES,
  play: KOREAN_PLAY_MESSAGES,
  clock: KOREAN_CLOCK_MESSAGES,
  resume: KOREAN_RESUME_MESSAGES,
  look: KOREAN_LOOK_MESSAGES,
  sound: KOREAN_SOUND_MESSAGES,
  record: KOREAN_RECORD_MESSAGES,
  overlays: KOREAN_OVERLAY_MESSAGES,
  plaque: KOREAN_PLAQUE_MESSAGES,
  welcome: KOREAN_WELCOME_MESSAGES,
  tour: KOREAN_TOUR_MESSAGES,
  translationNotice: KOREAN_TRANSLATION_NOTICE_MESSAGES,
  language: KOREAN_LANGUAGE_MESSAGES,
  you: KOREAN_YOU_MESSAGES,
  toasts: {
    signInToPlayAFriend: "친구와 온라인으로 두려면 로그인하세요.",
    invitationHeldByTheTutorial: "튜토리얼에서 나가면 친구의 초대가 열립니다",
  },
  tutorial: KOREAN_TUTORIAL_MESSAGES,
  friend: KOREAN_FRIEND_MESSAGES,
  settings: KOREAN_SETTINGS_MESSAGES,
  unlocks: KOREAN_UNLOCK_MESSAGES,
  release: {ready: "새 버전이 준비되었습니다", refresh: "새로고침", later: "나중에"},
  styles: KOREAN_STYLE_MESSAGES,
  pieceName: ({side, type}) => {
    if (type !== "soldier") return `${koreanSideName(side)} ${PIECE_NAMES[type]}`;
    if (side === "cho") return "초 졸";

    return "한 병";
  },
};

const PIECE_NAMES: Record<Exclude<PieceType, "soldier">, string> = {
  general: "궁",
  guard: "사",
  horse: "마",
  elephant: "상",
  chariot: "차",
  cannon: "포",
};
