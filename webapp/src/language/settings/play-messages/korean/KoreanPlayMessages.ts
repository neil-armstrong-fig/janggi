import type {PlayMessages} from "@src/language/settings/play-messages/PlayMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The Play tab, in Korean. */
export const KOREAN_PLAY_MESSAGES: PlayMessages = {
  games: "대국",
  gameNames: {local: "이 기기", friend: "온라인"},
  yourMove: " · 내 차례",
  format: "방식",
  formatNames: {Casual: "일반", Scored: "점수제"},
  opponent: "상대",
  opponentNames: {Human: "사람", Bot: "봇"},
  botStrength: "봇 실력",
  yourSide: "내 진영",
  sideChoiceNames: {Cho: "초", Han: "한", Random: "무작위"},
  setup: "상차림",
  setupNotChosen: "선택 전",
  setupOf: side => `${koreanSideName(side)} 상차림`,
  setupNames: {
    "Inner Elephant": "안상차림",
    "Outer Elephant": "바깥상차림",
    "Left Elephant": "왼상차림",
    "Right Elephant": "오른상차림",
    "Central Chariot": "기동차 차림",
  },
  flipBoard: "한 진영 쪽으로 판 돌리기",
  newGame: "새 게임",
  newGameCostsALoss: "지금 새 게임을 시작하면 패배로 기록됩니다.",
  setupDescriptions: {
    "Inner Elephant": "상 두 개는 사 옆에, 마 두 개는 차 옆에 둡니다. 가장 흔한 선택입니다.",
    "Outer Elephant": "상 두 개는 차 옆에 두어, 마 두 개가 궁성을 지킵니다.",
    "Left Elephant": "하나씩 섞습니다. 내 왼쪽 상은 바깥에, 오른쪽 상은 안쪽에 둡니다.",
    "Right Elephant": "왼상차림의 반대입니다. 내 오른쪽 상은 바깥에, 왼쪽 상은 안쪽에 둡니다.",
    "Central Chariot": "차를 사 옆으로 당겨 놓습니다. 일반 대국 전용이며 대회용 상차림이 아닙니다.",
  },
  setupPickerLabel: side => `${koreanSideName(side)} 시작 상차림`,
  armySwitchLabel: "상차림을 볼 진영",
  botStrengthLabel: "봇의 실력(Elo 레이팅)",
  yourSideLabel: "봇과 둘 때 내 진영",
  flipBoardHelp: "한의 차례가 되면 맞은편에 앉은 사람을 향하도록 말을 돌립니다.",
  gamesLabel: "판에 표시할 대국",
  formatLabel: "둘 장기의 방식",
  opponentLabel: "상대 진영을 두는 쪽",
  botNeedsIsolation: "이 브라우저에서는 봇을 실행할 수 없습니다. cross-origin isolated 페이지가 필요합니다.",
  elephantPairings: {
    matsang: "맞상 — 바깥쪽 상이 서로 마주 보며, 맞교환하게 됩니다",
    eotsang: "엇상 — 양쪽 진영이 같은 쪽으로 전개합니다",
  },
  botLock: ({beneath, choice, format}) => {
    const formatName = KOREAN_PLAY_MESSAGES.formatNames[format];
    if (choice === "Random") return `먼저 ${formatName} 대국에서 양쪽 진영으로 ${beneath} 봇을 이기세요`;

    return `먼저 ${formatName} 대국에서 ${KOREAN_PLAY_MESSAGES.sideChoiceNames[choice]} 진영으로 ${beneath} 봇을 이기세요`;
  },
  formatExplanation: {
    casual: {
      summary: "대부분의 장기 사이트에서 두는 친선 대국입니다.",
      points: [
        ["양쪽 진영이 차려진 채로 시작합니다. 어느 쪽이든 첫 수 전까지 바꿀 수 있습니다."],
        [
          "두 궁이 사이에 다른 말 없이 같은 세로줄에서 마주 보면 어느 쪽이든 ",
          {strong: "빅장"},
          "을 부를 수 있고, 대국은 ",
          {strong: "무승부"},
          "가 됩니다.",
        ],
        [
          "합의로 무승부를 할 수 있고, ",
          {strong: "양쪽 모두 30점 미만"},
          "이 되면 같은 국면이 세 번째 나타날 때도 무승부입니다.",
        ],
      ],
    },
    scored: {
      summary: "대한장기협회의 대회 방식입니다. 무승부가 없습니다.",
      points: [
        ["한이 먼저 상차림을 고르며 바꿀 수 없습니다. 초는 한의 상차림을 본 뒤에 고릅니다."],
        [
          "빅장은 ",
          {strong: "양쪽 모두 30점 미만"},
          "일 때만 부를 수 있고, 점수가 앞선 쪽이 ",
          {strong: "이깁니다"},
          ". 30점 미만에서 같은 국면이 세 번째 나타날 때도 마찬가지입니다.",
        ],
      ],
    },
    both: "두 방식 모두 한수쉼이 연속으로 두 번 나오면 점수로 대국이 끝나고, 한은 나중에 두는 대신 1.5점을 더 받고 시작합니다. 레이팅은 방식별로 따로 기록됩니다.",
  },
};
