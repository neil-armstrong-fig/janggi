import type {ResultMessages} from "@src/language/status/result-messages/ResultMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The result banner, and its explanations, in Korean. */
export const KOREAN_RESULT_MESSAGES: ResultMessages = {
  won: side => `${koreanSideName(side)} 승리`,
  wonOnPoints: side => `${koreanSideName(side)} 점수 승리`,
  lostOnTime: side => `${koreanSideName(side)} 시간패`,
  drawn: {bikjang: "빅장으로 무승부", repetition: "반복으로 무승부", agreement: "합의로 무승부"},
  newGame: "새 게임",
  unlocked: unlocks => `🔓 해금: ${unlocks}`,
  showBoard: "판 보기",
  newGameAt: botElo => `${botElo} 봇과 새 게임`,
  botPlaying: side => `봇(${koreanSideName(side)})`,
  bikjangExplanation: (caller, drawn) => {
    const called = `${caller}: 빅장 선언. 두 궁이 사이에 아무것도 없이 마주 보았습니다.`;
    if (drawn) {
      return `${called} 장기에서는 차례인 쪽이 이를 무승부로 선언할 수 있어, 궁을 마주 보게 두면 상대에게 선언권이 넘어갑니다.`;
    }

    return `${called} 점수제에서는 이 선언으로 대국이 끝나고 점수로 승패를 가립니다.`;
  },
  repetitionExplanation: drawn => {
    const cause =
      "같은 국면이 세 번째 나타났습니다. 양쪽 모두 30점 미만이면 반복이 허용되어, 달리 끝낼 방법이 없습니다.";
    if (drawn) return `${cause} 일반 대국은 무승부입니다.`;

    return `${cause} 점수제에는 무승부가 없어 대국이 멈추고 점수로 승패를 가립니다.`;
  },
};
