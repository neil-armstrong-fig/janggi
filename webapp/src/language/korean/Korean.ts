import type {Messages} from "@src/language/types/Messages";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * The game in Korean, using janggi's own terms where it has them — 한수쉼, 빅장, 외통, 장군 — rather than a
 * translation of the English. The sentences avoid a particle after an army's name (초 승리, not 초가
 * 이겼습니다), which changes with the sound before it and is a mistake waiting for a name the code does
 * not know yet.
 */
export const KOREAN: Messages = {
  tabs: {Play: "게임", Look: "화면", Sound: "소리", You: "내 정보"},
  controls: {
    pass: "한수쉼",
    bikjang: "빅장",
    draw: "무승부",
    undo: "무르기",
    redo: "다시",
    settings: "설정",
  },
  sides: {han: "한", cho: "초"},
  announcements: {
    botUnavailable: "봇을 쓸 수 없음",
    botLoading: "봇을 불러오는 중",
    botLayingOut: "봇이 상차림을 고르는 중",
    botThinking: "봇이 생각하는 중",
    won: side => `${sideName(side)} 승리`,
    wonOnPoints: side => `${sideName(side)} 점수승`,
    drawn: {bikjang: "빅장으로 무승부", repetition: "반복으로 무승부", agreement: "합의로 무승부"},
    inCheck: side => `${sideName(side)} 장군`,
    toMove: side => `${sideName(side)} 차례`,
    layingOut: side => `${sideName(side)} 상차림 차례`,
  },
  result: {
    won: side => `${sideName(side)} 승리`,
    wonOnPoints: side => `${sideName(side)} 점수 승리`,
    drawn: {bikjang: "빅장으로 무승부", repetition: "반복으로 무승부", agreement: "합의로 무승부"},
    newGame: "새 게임",
    showBoard: "판 보기",
    newGameAt: botElo => `${botElo} 봇과 새 게임`,
    botPlaying: side => `봇(${sideName(side)})`,
    bikjangExplanation: (caller, drawn) => {
      const called = `${caller}: 빅장 선언. 두 궁이 사이에 아무것도 없이 마주 보았습니다.`;
      if (drawn) {
        return `${called} 장기에서는 차례인 쪽이 이를 무승부로 선언할 수 있어, 궁을 마주 보게 두면 상대에게 선언권이 넘어갑니다.`;
      }

      return `${called} 점수제에서는 이 선언으로 대국이 끝나고 점수로 승패를 가립니다.`;
    },
    repetitionExplanation: drawn => {
      const cause =
        "같은 국면이 세 번째 나타났습니다. 양쪽 모두 30점 미만이면 반복이 허용되어, 달리 끝낼 방법이 없습니다.";
      if (drawn) return `${cause} 일반 대국은 무승부입니다.`;

      return `${cause} 점수제에는 무승부가 없어 대국이 멈추고 점수로 승패를 가립니다.`;
    },
  },
  play: {
    games: "대국",
    gameNames: {local: "이 기기", friend: "온라인"},
    yourMove: " · 내 차례",
    format: "방식",
    formatNames: {Casual: "일반", Scored: "점수제"},
    opponent: "상대",
    opponentNames: {Human: "사람", Bot: "봇"},
    botStrength: "봇 실력",
    yourSide: "내 진영",
    sideChoiceNames: {Cho: "초", Han: "한", Random: "무작위"},
    setup: "상차림",
    setupOf: side => `${sideName(side)} 상차림`,
    setupNames: {
      "Inner Elephant": "안상차림",
      "Outer Elephant": "바깥상차림",
      "Left Elephant": "왼상차림",
      "Right Elephant": "오른상차림",
      "Central Chariot": "기동차차림",
    },
    flipBoard: "한 진영 쪽으로 판 돌리기",
    newGame: "새 게임",
    newGameCostsALoss: "지금 새 게임을 시작하면 패배로 기록됩니다.",
  },
  look: {
    board: "판",
    pieces: "말",
    boardOf: side => `${sideName(side)} 판`,
    piecesOf: side => `${sideName(side)} 말`,
    differentBoard: "진영마다 다른 판",
    differentPieces: "진영마다 다른 말",
    yourStyles: "내 스타일",
    onTheBoard: "판 위에서",
    markMovable: "움직일 수 있는 말 표시",
    labelBikjang: "빅장이 되는 수 표시",
    bikjangHintNote:
      "두 궁이 마주 보게 되는 수에 빅장이라고 표시합니다. 같은 기기의 상대와 둘 때와 800, 1000 봇과 둘 때만 제공됩니다.",
    motion: "움직임: 말 이동, 연출, 흔들림",
    transparency: "설정창 투명도",
  },
  sound: {
    soundEffects: "효과음",
    muteSoundEffects: "효과음 끄기",
    music: "음악",
    muteMusic: "음악 끄기",
    muted: "꺼짐",
  },
  record: {
    title: "내 기록",
    closeLabel: "내 기록 닫기",
    rating: format => `${format} Elo`,
    bot: "봇",
    games: "대국",
    winsDrawsLosses: "승-무-패",
    winRate: "승률",
    winRateAs: side => `${sideName(side)} 승률`,
    noGames: "아직 봇과 둔 대국이 없습니다.",
    gameLine: (botElo, side) => `봇 ${botElo} · ${sideName(side)}`,
    results: {won: "승", drawn: "무", lost: "패"},
    endings: {
      checkmate: "외통",
      points: "점수",
      bikjang: "빅장",
      repetition: "반복",
      agreement: "합의",
      abandoned: "중단",
    },
    reset: "기록 초기화",
    resetLabel: "기록 초기화",
    resetQuestion: "두 방식의 레이팅과 모든 대국 기록을 지울까요? 되돌릴 수 없습니다.",
    keepIt: "취소",
    resetConfirm: "초기화",
  },
  overlays: {
    drawOffer: offeredBy => `${sideName(offeredBy)} 제안`,
    drawOfferNote: "양쪽이 모두 동의해야 합니다.",
    accept: "수락",
    decline: "거절",
    theBot: "봇",
    drawDeclined: who => `${who}: 무승부 거절. 대국을 계속합니다.`,
    botPlays: botSide => `봇은 ${sideName(botSide)}, 선수입니다`,
    settingsStayOpen: "봇이 시작할 때까지 설정이 열려 있습니다.",
    letTheBotStart: "봇 시작",
    wakingTheBot: "봇을 깨우는 중…",
    botCouldNotStart: "봇을 시작할 수 없습니다",
    tryAgain: "다시 시도",
    repetitionNotice:
      "같은 국면을 세 번째 만드는 수는 둘 수 없습니다. 체스와 달리 반복해도 무승부가 되지 않고, 그 수만 막히고 대국은 계속됩니다.",
  },
  plaque: {bot: "봇", player: "나"},
  welcome: {
    title: "장기에 오신 것을 환영합니다",
    aboutTheGame: "장기는 초와 한, 두 진영이 판 위에서 겨루어 상대의 궁을 잡는 쪽이 이기는 게임입니다.",
    aboutThisDevice: "처음에는 부담 없는 봇과 둡니다. 계정은 필요 없고, 모든 설정은 이 기기에 저장됩니다.",
    next: "다음",
    choicesTitle: "취향에 맞게 설정",
    music: "음악",
    soundEffects: "효과음",
    animations: "움직임 효과",
    showWhereAPieceCanMove: "말이 갈 수 있는 곳 표시",
    answers: {On: "켜기", Off: "끄기", Full: "전체", Reduced: "줄임", Shown: "표시", Hidden: "숨김"},
    changeAnyTime: "이 설정은 언제든 설정에서 바꿀 수 있습니다.",
    takeTheTour: "빠른 둘러보기",
    skip: "건너뛰고 바로 시작",
  },
  tour: {
    steps: styleEditorXp => ({
      "pick-up": {title: "말 집기", body: "내 말을 눌러 갈 수 있는 곳을 확인하세요."},
      move: {
        title: "말 옮기기",
        body: "표시된 곳을 눌러 옮기세요. 졸을 옆으로 옮기며 시작하는 것도 좋은 수입니다.",
      },
      controls: {
        title: "조작 버튼",
        body: "판 아래에서 한수쉼은 차례를 쉬고, 빅장은 두 궁이 마주 본 것을 알리고, 무승부는 무승부를 제안합니다. 무르기와 다시는 수를 되돌립니다. 봇과 둘 때는 쓸 수 없고, 둘이 함께 두는 대국에서 쓰입니다.",
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
        body: "가이드에서 모든 말과 규칙을 5분 안에 배울 수 있습니다. 첫 대국 전에 읽어 보세요.",
      },
    }),
    card: "빠른 둘러보기",
    stepOf: (step, count) => `${step} / ${count} 단계`,
    openTheGuide: "가이드 열기",
    skip: "둘러보기 건너뛰기",
    back: "이전",
    next: "다음",
    finish: "완료",
  },
  translationNotice: {
    title: "한국어 번역 작업 중",
    body: "한국어 번역은 아직 작업 중입니다. 일부는 아직 영어로 표시되고, 어색한 표현이 있을 수 있습니다. 양해 부탁드립니다.",
    dismiss: "확인",
  },
  language: {label: "언어", names: {en: "English", ko: "한국어"}},
};

function sideName(side: Side): string {
  return KOREAN.sides[side];
}
