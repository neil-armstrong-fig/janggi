import type {GuideMessages} from "@src/language/types/guide/GuideMessages";

/**
 * The guide in Korean, **machine translated** from `ENGLISH_GUIDE` and not yet read by a native speaker, which is why
 * the page says so before anything else. It uses janggi's own terms where there are some (외통, 한수쉼, 빅장, 상차림,
 * 궁성), as the game's Korean does (`docs/localisation.md`). The link to the rules research leads to an English
 * page, and its text says so.
 */
export const KOREAN_GUIDE: GuideMessages = {
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
  pieces: {
    eyebrow: "03 · 일곱 종류의 말",
    heading: "말의 움직임",
    introduction:
      "모든 말은 평소 움직이는 방식 그대로 상대 말을 잡습니다. 자기 진영의 말이 있는 자리에는 들어갈 수 없습니다. 아래의 말을 눌러 작은 판에서 움직임을 확인해 보세요.",
    styleLabel: "말 모양",
    styleGroupLabel: "예시 말의 모양 고르기",
    styles: {traditional: "전통", hangul: "한글", modern: "현대"},
    pieces: {
      general: {
        name: "궁(왕)",
        mark: "궁 · 장",
        description: "그려진 선을 따라 한 칸 움직이며, 자기 궁성을 벗어날 수 없습니다. 이 말을 외통으로 몰면 이깁니다.",
        caption: "궁성의 선을 따라 한 칸. 궁은 자기 궁성 안에 머뭅니다.",
      },
      guard: {
        name: "사(士)",
        mark: "사",
        description: "궁과 똑같이 움직입니다. 선을 따라 한 칸, 항상 자기 궁성 안에서만 움직입니다.",
        caption: "궁성의 선을 따라 한 칸, 궁성을 벗어나지 않습니다.",
      },
      chariot: {
        name: "차(車)",
        mark: "차",
        description: "가로나 세로로, 또는 궁성에 그려진 대각선을 따라 막힐 때까지 몇 칸이든 움직입니다.",
        caption: "직선으로 몇 칸이든, 그리고 궁성에 그려진 대각선을 따라서도 움직입니다.",
      },
      cannon: {
        name: "포(包)",
        mark: "포",
        description:
          "차처럼 움직이되, 반드시 다른 말 하나만을 뛰어넘어야 합니다. 뛰어넘는 말이 포일 수는 없으며, 포는 포를 잡을 수 없습니다.",
        caption: "반드시 말 하나를 뛰어넘어야 합니다. 윤곽선이 있는 지점이 뛰어넘는 말입니다.",
      },
      horse: {
        name: "마(馬)",
        mark: "마",
        description: "직선으로 한 칸 간 뒤 바깥쪽 대각선으로 한 칸 움직입니다. 첫 번째 칸에 말이 있으면 막힙니다.",
        caption: "직선으로 한 칸, 이어서 바깥 대각선으로 한 칸. 첫 번째 칸이 막힐 수 있습니다.",
      },
      elephant: {
        name: "상(象)",
        mark: "상",
        description:
          "직선으로 한 칸 간 뒤 바깥쪽 대각선으로 두 칸 움직입니다. 경로의 두 지점 중 어느 한 곳에 말이 있어도 막힙니다.",
        caption: "직선으로 한 칸, 이어서 바깥 대각선으로 두 칸. 경로의 어느 지점이든 막힐 수 있습니다.",
      },
      soldier: {
        name: "졸·병(卒·兵)",
        mark: "졸 · 병",
        description:
          "앞이나 옆으로 한 칸 움직이며 뒤로는 갈 수 없습니다. 상대 궁성 안에서는 앞쪽 대각선으로도 움직일 수 있습니다.",
        caption: "앞이나 옆으로 한 칸, 그리고 궁성의 앞쪽 대각선. 뒤로는 갈 수 없습니다.",
      },
    },
    valuesLabel: "장기 말의 점수",
    values: {
      before: "",
      marked: "전통적인 점수:",
      after: " 차 13 · 포 7 · 마 5 · 상 3 · 사 3 · 졸 2",
    },
    sources: {
      start: "움직임과 점수는 ",
      firstLink: "대한장기협회의 기물행마법",
      middle: "을 바탕으로 합니다. ",
      secondLink: "이 게임의 규칙 연구(영어)",
      end: "에는 이 요약의 배경이 된 번역과 비교, 결정 사항이 기록되어 있습니다.",
    },
  },
  rules: {
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
    sources: {
      start: "",
      firstLink: "규칙과 대국 방식 출처",
      middle: "에는 궁성의 선, 포, 한수쉼, 빅장에 대한 내용이 담겨 있습니다. ",
      secondLink: "상차림 연구",
      end: "에는 네 가지 상차림을 어떻게 비교하고 이름 붙였는지가 설명되어 있습니다.",
    },
  },
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
  questions: {
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
  },
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
