import type {GuidePiecesMessages} from "@src/language/guide/guide-pieces-messages/GuidePiecesMessages";

/** The guide's pieces section, in Korean. */
export const KOREAN_GUIDE_PIECES_MESSAGES: GuidePiecesMessages = {
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
      description:
        "직선으로 한 칸 간 뒤 바깥쪽 대각선으로 한 칸 움직입니다. 체스의 나이트와 달리 뛰어넘을 수 없어, 첫 번째 칸(멱)에 어느 편 말이든 있으면 그 너머의 두 수가 막힙니다.",
      caption: "직선으로 한 칸, 이어서 바깥 대각선으로 한 칸. 직선 칸에 말이 있으면 그 칸을 지나는 두 수가 막힙니다.",
    },
    elephant: {
      name: "상(象)",
      mark: "상",
      description:
        "직선으로 한 칸 간 뒤 바깥쪽 대각선으로 두 칸 움직이며, 판 어디로든 갈 수 있습니다. 상도 뛰어넘을 수 없어, 직선 칸이나 첫 번째 대각선 칸에 말이 있으면 막힙니다.",
      caption:
        "직선으로 한 칸, 이어서 바깥 대각선으로 두 칸. 직선 칸의 말은 두 수를, 첫 번째 대각선 칸의 말은 한 수를 막습니다.",
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
};
