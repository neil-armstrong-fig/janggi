import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's bikjang scene (`A_BIKJANG`, in `react/pages/game/tutorial/scenes/`), in Korean. */
export const KOREAN_A_BIKJANG: TutorialSceneWords = {
  name: "빅장",
  steps: [
    {
      title: "궁과 궁이 마주 봅니다",
      body: "이 장면에는 말이 몇 개만 남았습니다. 가운데 줄에서 두 궁 사이를 막는 것은 한의 사뿐입니다. 졸을 앞으로 옮기고 한의 응수를 보세요.",
    },
    {title: "한의 사가 비킵니다", body: "한의 사가 옆으로 비킵니다."},
    {
      title: "빅장 부르기",
      body: "한의 사가 비켜서 이제 두 궁 사이에 아무것도 없습니다. 이것이 빅장입니다. 둘 차례인 쪽은 빅장을 불러 대국을 끝낼 수 있습니다. 빅장을 누르세요.",
    },
  ],
  ending: {
    title: "빅장: 무승부",
    body: "일반 대국에서 빅장을 부르면 무승부입니다. 점수제에서는 대신 점수로 승패를 가리며, 양쪽 모두 30점 미만일 때만 부를 수 있습니다.",
  },
};
