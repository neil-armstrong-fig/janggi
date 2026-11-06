import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's agreed draw scene (`AN_AGREEMENT`, in `react/pages/game/tutorial/scenes/`), in Korean. */
export const KOREAN_AN_AGREEMENT: TutorialSceneWords = {
  name: "합의",
  steps: [
    {
      title: "무승부 제안",
      body: "일반 대국에서는 두 사람이 합의하여 무승부로 끝낼 수 있습니다. 무승부를 누르세요. 한이 받아들입니다.",
    },
  ],
  ending: {
    title: "합의: 무승부",
    body: "한이 받아들여 대국은 무승부입니다. 점수제에는 합의할 무승부가 없습니다. 그만두고 싶은 두 사람은 각자 한수쉼을 하고, 점수로 승패를 가립니다.",
  },
};
