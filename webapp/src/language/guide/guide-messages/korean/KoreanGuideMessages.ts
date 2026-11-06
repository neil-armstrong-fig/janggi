import type {GuideMessages} from "@src/language/guide/guide-messages/GuideMessages";
import {KOREAN_GUIDE_PIECES_MESSAGES} from "@src/language/guide/guide-pieces-messages/korean/KoreanGuidePiecesMessages";
import {KOREAN_GUIDE_QUESTIONS_MESSAGES} from "@src/language/guide/guide-questions-messages/korean/KoreanGuideQuestionsMessages";
import {KOREAN_GUIDE_RULES_MESSAGES} from "@src/language/guide/guide-rules-messages/korean/KoreanGuideRulesMessages";

/**
 * The guide in Korean, **machine translated** from `ENGLISH_GUIDE_MESSAGES` and not yet read by a native speaker, which is why
 * the page says so before anything else. It uses janggi's own terms where there are some (외통, 한수쉼, 빅장, 상차림,
 * 궁성), as the game's Korean does (`docs/localisation.md`). The link to the rules research leads to an English
 * page, and its text says so.
 */
export const KOREAN_GUIDE_MESSAGES: GuideMessages = {
  skipLink: "가이드로 바로 가기",
  translationNotice: {
    statement: "이 가이드는 영어 원문을 기계 번역한 것으로, 오역이나 어색한 표현이 있을 수 있습니다.",
    statementInEnglish: "This guide was machine translated from the English original and may contain mistakes.",
    linkToOriginal: "영어 가이드 보기 (Read the English guide)",
    label: "기계 번역 안내",
  },
  header: {
    homeLabel: "장기 게임",
    logoAlt: "장기 게임 로고",
    brand: "Janggi",
    tagline: "장기 · 무료로 두기",
    navigationLabel: "가이드 메뉴",
    pieces: "말",
    questions: "질문",
    play: "무료로 두기",
    languageLabel: "언어",
    languageNames: {en: "English", ko: "한국어"},
  },
  hero: {
    eyebrow: "초보자를 위한 완벽 가이드",
    heading: "장기 두는 법",
    summary:
      "장기판과 일곱 종류의 말, 그리고 체스와 다른 장기만의 규칙을 배워 보세요. 그런 다음 친구나 컴퓨터와 대국해 보세요.",
    play: "무료로 장기 두기",
    install: "이 기기에 설치",
    startWithRules: "규칙부터 시작",
    tutorial: {start: "안내를 따라 두며 배우기", resume: "안내 대국 이어 하기", again: "안내 대국 다시 하기"},
    accountNote:
      "친구와 온라인으로 두려면 Google 로그인이 필요합니다. AI 대국과 오프라인 플레이는 계정이 필요 없습니다.",
    factsLabel: "장기 한눈에 보기",
    facts: [
      {label: "판", value: "9 × 10 교차점"},
      {label: "대국자", value: "2명 · 초와 한"},
      {label: "말", value: "진영마다 16개"},
      {label: "목표", value: "상대 궁을 외통으로 몰기"},
    ],
  },
  introduction: {
    eyebrow: "01 · 게임 소개",
    heading: "장기란 무엇인가요?",
    game: {
      before: "",
      marked: "장기(Janggi)",
      after:
        "는 영어권에서 보통 ‘Korean chess’라고 부르는 2인용 전략 보드게임입니다. 체스, 중국 장기(샹치), 일본 장기(쇼기) 등과 같은 계열의 게임이지만, 탁 트인 판, 멀리 가는 상, 뛰어넘는 포, 궁성의 대각선 때문에 다르게 전개됩니다.",
    },
    board:
      "말은 세로 9줄과 가로 10줄이 만나는 교차점 위에 놓입니다. 청록색의 초 진영이 아래쪽에서 시작해 먼저 둡니다. 붉은색의 한 진영은 위쪽에서 시작하며, 점수제 대국에서는 덤으로 1.5점을 받고 시작합니다. 각 궁은 대각선이 그려진 3×3 크기의 궁성 안에서만 움직입니다.",
  },
  winning: {
    eyebrow: "02 · 목표",
    heading: "이기는 방법",
    objective: {
      before: "대국자는 번갈아 가며 말 하나를 움직이거나 한수쉼을 선택합니다. 상대의 궁을 ",
      marked: "외통",
      after:
        "으로 몰면 이깁니다. 외통이란 상대 궁에 장군을 불렀는데 이를 벗어날 합법적인 수가 하나도 없는 상태입니다. 둔 뒤 자기 궁이 장군 상태가 되는 수는 둘 수 없습니다.",
    },
    captures:
      "상대 말이 있는 자리로 움직이면 그 말을 잡습니다. 체스와 달리 장기에서는 한수쉼이 가능하기 때문에 스테일메이트, 즉 둘 수 있는 수가 없는 상태로 대국이 끝나지 않습니다. 이 앱에서는 한수쉼이 연속으로 두 번 나오면 대국이 멈추고, 판 위에 남은 말의 점수로 승패를 가립니다.",
  },
  pieces: KOREAN_GUIDE_PIECES_MESSAGES,
  rules: KOREAN_GUIDE_RULES_MESSAGES,
  matchFormats: {
    eyebrow: "05 · 대국 방식 고르기",
    heading: "일반 장기와 점수제 장기",
    casual: {
      label: "일반",
      title: "익숙한 온라인 대국",
      body: "양쪽 진영은 일반적인 상차림으로 시작하며 첫 수를 두기 전에 상차림을 바꿀 수 있습니다. 빅장을 부르면 무승부로 끝나고, 합의한 무승부나 양쪽 모두 30점 미만일 때 같은 국면이 세 번째로 나타나는 경우에도 무승부가 됩니다. 배우기에 가장 쉬운 방식이며, 한 기기에서 함께 둘 때 쓰기 좋습니다.",
    },
    scored: {
      label: "점수제",
      title: "대회 방식",
      body: "한이 먼저 상차림을 고르고 초가 이에 맞춰 고르며, 한은 덤으로 1.5점을 가지고 시작합니다. 빅장은 보통 양쪽 모두 남은 점수가 30점 미만일 때만 부를 수 있고, 결과는 점수로 정해집니다. 30점 미만에서 같은 국면이 계속 돌고 도는 경우도 마찬가지입니다.",
    },
    sources: {
      before:
        "이 게임은 공개된 규칙이 두 방식을 모두 설명하고 있기 때문에 두 가지 해석을 모두 지원합니다. 한국어 1차 출처와 번역은",
      marked: "규칙 출처와 연구 노트",
      after: "에서 확인할 수 있습니다.",
    },
  },
  questions: KOREAN_GUIDE_QUESTIONS_MESSAGES,
  closing: {
    eyebrow: "규칙을 익히셨나요?",
    heading: "장기 한 판 시작하기",
    summary: "친구와 마주 앉아 두거나, 설정에서 컴퓨터 상대를 고르세요.",
    play: "무료로 장기 두기",
  },
  footer: {
    brand: "Janggi · 장기",
    navigationLabel: "하단 메뉴",
    play: "게임",
    sources: "참고 자료 및 출처",
    sourceCode: "소스 코드",
  },
};
