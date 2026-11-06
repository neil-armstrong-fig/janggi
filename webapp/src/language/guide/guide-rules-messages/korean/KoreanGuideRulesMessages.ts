import type {GuideRulesMessages} from "@src/language/guide/guide-rules-messages/GuideRulesMessages";

/** The guide's rules section, in Korean. */
export const KOREAN_GUIDE_RULES_MESSAGES: GuideRulesMessages = {
  eyebrow: "04 · 장기만의 특징",
  heading: "장기만의 규칙",
  noRiver: {
    title: "강이 없습니다",
    body: "판 전체가 처음부터 열려 있습니다. 졸과 병은 처음부터 옆으로 움직일 수 있고, 상은 상대 진영으로 넘어갈 수 있습니다.",
  },
  cannons: {
    title: "포는 반드시 뛰어넘어야 합니다",
    body: "포는 잡지 않고 움직일 때도 반드시 다른 말 하나만을 뛰어넘어야 합니다. 다른 포를 뛰어넘을 수 없고, 포가 다른 포를 잡을 수도 없습니다.",
  },
  palaces: {
    title: "궁성에서는 대각선으로도 움직입니다",
    body: "궁과 사는 자기 궁성의 선을 따라 움직입니다. 차와 포는 양쪽 궁성의 대각선을 모두 쓸 수 있고, 상대 궁성에 들어간 졸과 병은 앞쪽 대각선으로 움직일 수 있습니다.",
  },
  openings: {
    title: "상차림을 고릅니다",
    body: "대국을 시작하기 전에 각 진영은 뒷줄에서 마 두 개와 상 두 개를 어떤 순서로 놓을지 고릅니다. 네 가지 표준 상차림에 따라 판의 어느 쪽이 먼저 전개되는지가 달라집니다.",
  },
  passing: {
    title: "한수쉼이 가능합니다",
    body: "궁이 장군 상태가 아니라면 한수쉼으로 차례를 넘길 수 있습니다. 그래서 장기에는 스테일메이트가 없습니다.",
  },
  bikjang: {
    title: "마주 보는 궁은 빅장이 됩니다",
    body: {
      before: "두 궁이 사이에 다른 말 없이 같은 세로줄에서 서로 마주 보게 되면 대국자는 ",
      marked: "빅장",
      after: "(bikjang) 선언을 할 수 있습니다. 이 선언이 무엇을 결정하는지는 대국 방식에 따라 다릅니다.",
    },
  },
  repetition: {
    title: "같은 국면을 반복할 수 없습니다",
    body: "같은 국면을 세 번째로 만드는 수는 둘 수 없습니다. 체스에서는 이런 반복이 무승부가 되지만, 장기에서는 그 수 자체가 허용되지 않습니다. 양쪽 모두 30점 미만이면 허용되며, 그때는 대국이 끝납니다. 일반 대국은 무승부, 점수제 대국은 점수로 승패를 가립니다.",
  },
  sources: {
    start: "",
    firstLink: "규칙과 대국 방식 출처",
    middle: "에는 궁성의 선, 포, 한수쉼, 빅장에 대한 내용이 담겨 있습니다. ",
    secondLink: "상차림 연구",
    end: "에는 네 가지 상차림을 어떻게 비교하고 이름 붙였는지가 설명되어 있습니다.",
  },
};
