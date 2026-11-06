import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's resting turns scene (`RESTING_TURNS`, in `react/pages/game/tutorial/scenes/`), in Korean. */
export const KOREAN_RESTING_TURNS: TutorialSceneWords = {
  name: "한수쉼",
  steps: [
    {
      title: "차례 쉬기",
      body: "수를 두는 대신 차례를 한 번 쉴 수 있습니다. 이를 한수쉼이라 하며, 장군을 받은 상태에서는 쉴 수 없습니다. 여기서는 내가 크게 앞서 있습니다. 한수쉼을 누르세요.",
    },
    {title: "한도 쉽니다", body: "한도 차례를 쉽니다."},
  ],
  ending: {
    title: "점수: 초 점수승",
    body: "한수쉼이 연속으로 두 번 나오면 대국이 끝나고 점수로 승패를 가립니다. 남은 말마다 점수가 있습니다. 차 13, 포 7, 마 5, 상 3, 사 3, 졸·병 2이며, 한은 나중에 두는 대신 덤으로 1.5점을 더 받습니다. 여기서는 초 20점, 한 6.5점입니다.",
  },
};
