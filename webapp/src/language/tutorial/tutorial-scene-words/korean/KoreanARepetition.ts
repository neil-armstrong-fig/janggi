import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's repetition scene (`A_REPETITION`, in `react/pages/game/tutorial/scenes/`), in Korean. */
export const KOREAN_A_REPETITION: TutorialSceneWords = {
  name: "반복",
  steps: [
    {title: "한이 차를 움직입니다", body: "한의 차가 한 칸 내려옵니다."},
    {
      title: "제자리 맴돌기",
      body: "여기서는 양쪽 모두 말이 넉넉하게 남아, 각각 33점입니다. 한이 차를 움직였으니 내 차도 한 칸 올리세요.",
    },
    {title: "한이 되돌아갑니다", body: "한의 차가 되돌아갑니다."},
    {
      title: "다시 제자리로",
      body: "한의 차가 되돌아갔습니다. 내 차도 되돌리세요. 그러면 처음 국면이 두 번째로 나타납니다.",
    },
    {title: "한이 또 맴돕니다", body: "한의 차가 다시 움직입니다."},
    {title: "한 번 더", body: "한이 다시 맴돌고 있습니다. 한 번 더 따라가세요."},
    {title: "한이 되돌아갑니다", body: "한의 차가 되돌아갑니다."},
    {
      title: "세 번째는 안 됩니다",
      body: "한이 되돌아갔습니다. 지금 되돌리면 처음 국면이 세 번째로 나타나는데, 한쪽이라도 30점 이상이면 그렇게 둘 수 없습니다. 판 위의 알림이 이를 알려 주고, 되돌아갈 자리에 표시가 됩니다. 대신 차를 줄을 따라 위로 올리세요.",
    },
  ],
  ending: {
    title: "반복: 세 번째는 안 됩니다",
    body: "한쪽이라도 말이 30점 이상 남아 있으면 같은 국면이 세 번째 나타날 수 없어, 대국은 계속되고 누군가 새 수를 두어야 합니다. 양쪽 모두 30점 미만이면 세 번째도 허용되며, 그때는 대국이 끝납니다. 일반 대국은 무승부이고, 점수제는 점수로 승패를 가립니다.",
  },
};
