import type {OverlayMessages} from "@src/language/status/overlay-messages/OverlayMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The notices over the board, in Korean. */
export const KOREAN_OVERLAY_MESSAGES: OverlayMessages = {
  drawOffer: offeredBy => `${koreanSideName(offeredBy)} 제안`,
  drawOfferNote: "양쪽이 모두 동의해야 합니다.",
  accept: "수락",
  decline: "거절",
  theBot: "봇",
  drawDeclined: who => `${who}: 무승부 거절. 대국을 계속합니다.`,
  botPlays: botSide => `봇은 ${koreanSideName(botSide)} 진영이며 먼저 둡니다`,
  settingsStayOpen: "봇이 시작할 때까지 설정이 열려 있습니다.",
  letTheBotStart: "봇 시작",
  wakingTheBot: "봇을 깨우는 중…",
  botCouldNotStart: "봇을 시작할 수 없습니다",
  tryAgain: "다시 시도",
  repetitionNotice:
    "같은 국면을 세 번째 만드는 수는 둘 수 없습니다. 체스와 달리 반복해도 무승부가 되지 않고, 그 수만 막히고 대국은 계속됩니다.",
  peekLabel: "결과 다시 보기",
  peekNote: "대국 종료 · 판을 누르면 결과를 볼 수 있습니다",
};
