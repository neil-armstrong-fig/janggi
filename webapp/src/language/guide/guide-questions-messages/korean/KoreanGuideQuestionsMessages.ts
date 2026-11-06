import type {GuideQuestionsMessages} from "@src/language/guide/guide-questions-messages/GuideQuestionsMessages";

/** The guide's questions, in Korean. */
export const KOREAN_GUIDE_QUESTIONS_MESSAGES: GuideQuestionsMessages = {
  eyebrow: "06 · 빠른 답변",
  heading: "장기 자주 묻는 질문",
  chineseChess: {
    question: "장기는 중국 장기인 샹치와 같은가요?",
    answer:
      "아니요. 장기와 중국 장기인 샹치는 서로 친척 관계지만, 장기에는 강이 없고, 상의 움직임이 더 길며, 졸과 병이 처음부터 옆으로 움직일 수 있고, 포와 궁성, 상차림에도 서로 다른 규칙이 있습니다.",
  },
  free: {
    question: "장기를 온라인에서 무료로 둘 수 있나요?",
    answer: {
      before:
        "네. 이 브라우저 게임은 무료이고 계정이 필요 없으며, 친구와 두거나 여덟 단계의 컴퓨터 실력 중에서 고를 수 있습니다. 휴대폰에서는 이 페이지 위쪽의 ",
      marked: "이 기기에 설치",
      after: "를 선택하세요. 그러면 오프라인에서도 둘 수 있습니다.",
    },
  },
  firstMove: {
    question: "장기에서는 누가 먼저 두나요?",
    answer: "청록색 진영인 초가 먼저 둡니다. 점수제 대국에서는 나중에 두는 한이 덤으로 1.5점을 받습니다.",
  },
  passing: {
    question: "차례를 넘길 수 있나요?",
    answer:
      "네. 궁이 장군 상태가 아니라면 한수쉼은 합법입니다. 이 게임에서는 한수쉼이 연속으로 두 번 나오면 대국이 끝나고, 판 위에 남은 말의 점수로 승자를 가립니다.",
  },
  computer: {
    question: "컴퓨터와 장기를 둘 수 있나요?",
    answer: {
      before: "네. 내장된 ",
      marked: "Fairy-Stockfish",
      after:
        " 상대는 초급부터 전문가까지 여덟 단계의 실력을 갖추고 있습니다. 초와 한 중 어느 쪽이든 고를 수 있고, 전적은 기기에 저장됩니다.",
    },
  },
};
