import type {AnnouncementMessages} from "@src/language/status/announcement-messages/AnnouncementMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The turn line over the board, in Korean. */
export const KOREAN_ANNOUNCEMENT_MESSAGES: AnnouncementMessages = {
  botUnavailable: "봇을 쓸 수 없음",
  botLoading: "봇을 불러오는 중",
  botLayingOut: "봇이 상차림을 고르는 중",
  botThinking: "봇이 생각하는 중",
  won: side => `${koreanSideName(side)} 승리`,
  wonOnPoints: side => `${koreanSideName(side)} 점수승`,
  drawn: {bikjang: "빅장으로 무승부", repetition: "반복으로 무승부", agreement: "합의로 무승부"},
  inCheck: side => `${koreanSideName(side)} 궁 장군 상태`,
  toMove: side => `${koreanSideName(side)} 차례`,
  layingOut: side => `${koreanSideName(side)} 상차림 차례`,
};
