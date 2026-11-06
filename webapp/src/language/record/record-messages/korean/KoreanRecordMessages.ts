import type {RecordMessages} from "@src/language/record/record-messages/RecordMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The record sheet, in Korean. */
export const KOREAN_RECORD_MESSAGES: RecordMessages = {
  title: "내 기록",
  closeLabel: "내 기록 닫기",
  rating: format => `${format} Elo`,
  bot: "봇",
  games: "대국",
  winsDrawsLosses: "승-무-패",
  winRate: "승률",
  winRateAs: side => `${koreanSideName(side)} 승률`,
  noGames: "아직 봇과 둔 대국이 없습니다.",
  gameLine: (botElo, side) => `봇 ${botElo} · ${koreanSideName(side)}`,
  results: {won: "승", drawn: "무", lost: "패"},
  endings: {
    checkmate: "외통",
    points: "점수",
    bikjang: "빅장",
    repetition: "반복",
    agreement: "합의",
    abandoned: "중단",
  },
  reset: "기록 초기화",
  resetLabel: "기록 초기화",
  resetQuestion: "두 방식의 레이팅과 모든 대국 기록을 지울까요? 되돌릴 수 없습니다.",
  keepIt: "취소",
  resetConfirm: "초기화",
  formatsLabel: "대국 방식",
  credit: {
    start: "봇은 ",
    firstLink: "Fairy-Stockfish",
    middle: "입니다. 자유 소프트웨어이며 라이선스는 ",
    secondLink: "GPL-3.0",
    end: "입니다. 실력은 명목상의 Elo로, 장기가 아닌 체스를 기준으로 맞춘 값입니다.",
  },
};
