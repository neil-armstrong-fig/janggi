import type {YouMessages} from "@src/language/settings/you/you-messages/YouMessages";

/** The You tab, in Korean. */
export const KOREAN_YOU_MESSAGES: YouMessages = {
  progress: {
    xp: amount => `${amount} XP`,
    explainLabel: "XP를 얻는 방법",
    explanation:
      "봇과의 대국을 끝내면 XP를 얻습니다. 이기면 더 많이 얻고, 점수제 대국도 마찬가지입니다. 봇을 이기면 그다음 단계의 봇이 열리며, 초와 한은 따로 계산됩니다.",
    nextUnlock: (xp, unlocks) => `다음 해금, ${xp} XP: ${unlocks}`,
    allUnlocked: "모든 것이 해금되었습니다.",
    barLabel: "다음 해금까지의 진행도",
  },
  account: {
    label: "계정",
    heading: "내 게임 동기화하기",
    signedOutIntro:
      "Google로 로그인하면 XP, 해금 항목, 봇 전적, 스타일과 화면 설정이 기기 간에 동기화됩니다. 계정이 없어도 장기는 똑같이 작동합니다.",
    whatIsKept:
      "장기는 익명의 Google 계정 ID, 표시 이름, 저장 데이터를 보관합니다. 앱은 Google 이름이나 이메일을 볼 수 없습니다.",
    signIn: "Google로 로그인",
    signingIn: "로그인 마무리 중…",
    signedInWith: "Google로 로그인됨",
    sync: {
      idle: "동기화 중…",
      synced: "진행 상황이 동기화되어 있습니다.",
      paused: "동기화가 일시 중지되었습니다. 다음에 변경하면 다시 시도합니다.",
      tooLarge:
        "데이터가 너무 커서 동기화할 수 없어 이 기기에만 저장됩니다. 스타일을 한두 개 삭제하면 다시 동기화할 수 있습니다.",
    },
    signOut: "로그아웃",
    deleteAccount: "내 계정 삭제",
    deleteWhatTheServerHolds: "서버에 있는 데이터 삭제",
    legal: {
      start: "로그인하면 ",
      firstLink: "이용약관(영어)",
      middle: "에 동의하고 ",
      secondLink: "개인정보처리방침(영어)",
      end: "을 확인한 것으로 간주합니다.",
    },
    name: {
      label: "표시 이름",
      placeholder: "표시 이름 바꾸기",
      save: "저장",
      badLength: longest => `이름은 1자에서 ${longest}자까지이며 줄바꿈을 넣을 수 없습니다.`,
      notAllowed: "사용할 수 없는 이름입니다.",
      couldNotChange: "지금은 이름을 바꿀 수 없습니다. 나중에 다시 시도해 주세요.",
      changed: "이름이 바뀌었습니다.",
    },
    turnNotifications: {
      label: "내 차례가 되면 알려 주기",
      on: "켜짐",
      off: "꺼짐",
      blocked: "브라우저 설정에서 장기의 알림이 차단되어 있어 내 차례를 알려 드릴 수 없습니다.",
    },
  },
  links: {
    heading: "앱 및 도움말",
    install: "장기 설치",
    guide: {title: "장기 두는 법", note: "규칙과 말 안내"},
    replayTour: {title: "둘러보기 다시 보기", note: "다시 안내해 드릴게요"},
    references: {title: "참고 자료 및 출처", note: "다양한 자료"},
    developerWebsite: "개발자 웹사이트",
    repository: {title: "소스 코드", note: "GitHub"},
  },
  version: "버전",
  saveTransfer: {
    toggle: "내 진행 상황을 다른 기기로 옮기기",
    explanation:
      "저장 키를 쓰면 계정이나 인터넷 연결 없이도 진행 상황을 직접 옮길 수 있어, 장기를 완전히 오프라인으로 쓸 수 있습니다. 키에는 XP, 이긴 봇, 직접 만든 스타일이 들어 있으며, 키를 불러오면 지금의 XP는 키에 담긴 XP로 대체됩니다. 키를 옮기는 것이 번거롭다면 위에서 Google로 로그인하면 모두 자동으로 동기화됩니다.",
    copy: "저장 키 복사",
    load: "저장 데이터 불러오기",
    placeholder: "저장 키를 붙여넣으세요",
    notAKey: "저장 키가 아닙니다.",
    loaded: "불러왔습니다. 이제 XP와 해금 항목은 이 저장 데이터를 따릅니다.",
  },
  keys: {
    keyLabel: "공유할 키",
    copied: "복사했습니다. 안전한 곳에 보관하거나 필요한 곳에 보내세요.",
    selectToCopy: "위의 키를 선택해 복사하세요.",
  },
};
