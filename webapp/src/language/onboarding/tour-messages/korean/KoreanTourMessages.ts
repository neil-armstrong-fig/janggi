import type {TourMessages} from "@src/language/onboarding/tour-messages/TourMessages";

/** The quick tour, in Korean. */
export const KOREAN_TOUR_MESSAGES: TourMessages = {
  steps: styleEditorXp => ({
    "pick-up": {title: "말 집기", body: "내 말을 눌러 갈 수 있는 곳을 확인하세요."},
    move: {
      title: "말 옮기기",
      body: "표시된 곳을 눌러 옮기세요. 졸을 옆으로 옮기며 시작하는 것도 좋은 수입니다.",
    },
    controls: {
      title: "조작 버튼",
      body: "판 아래에서 한수쉼은 차례를 쉬고, 빅장은 두 궁이 마주 본 것을 알리고, 무승부는 무승부를 제안합니다. 무르기와 다시 두기로 수를 되돌리거나 다시 둘 수 있습니다. 봇과 둘 때는 쓸 수 없고, 둘이 함께 두는 대국에서 쓰입니다.",
    },
    settings: {
      title: "설정",
      body: "나머지는 모두 설정에 있습니다: 대국 방식, 화면, 소리, 내 진행 상황. 눌러서 열어 보세요.",
    },
    xp: {
      title: "XP 쌓기",
      body: "대국을 하면 XP를 얻고, XP로 새 판과 새 말, 더 강한 봇을 열 수 있습니다.",
    },
    styles: {
      title: "나만의 스타일",
      body: `${styleEditorXp} XP가 되면 나만의 판과 말을 직접 만들 수 있습니다. 다른 사람이 공유한 스타일은 무료로 가져올 수 있습니다.`,
    },
    account: {
      title: "기기 간 동기화",
      body: "Google 로그인은 선택 사항입니다. 하지 않아도 똑같이 즐길 수 있습니다. 로그인하면 XP, 해금 항목, 스타일이 여러 기기에서 이어지며, 친구와 온라인으로 두려면 로그인이 필요합니다.",
    },
    friend: {
      title: "친구와 두기",
      body: "온라인을 눌러 코드를 만들어 친구에게 보내거나 친구의 코드를 입력하면 실시간으로 함께 둘 수 있습니다. 두 사람 모두 로그인해야 합니다.",
    },
    guide: {
      title: "장기가 처음이신가요?",
      body: "가이드에서 모든 말과 규칙을 약 5분이면 배울 수 있습니다. 첫 대국 전에 읽어 보세요.",
    },
  }),
  card: "빠른 둘러보기",
  stepOf: (step, count) => `${step} / ${count} 단계`,
  openTheGuide: "가이드 열기",
  skip: "둘러보기 건너뛰기",
  back: "이전",
  next: "다음",
  finish: "완료",
};
