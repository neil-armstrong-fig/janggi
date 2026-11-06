import type {FriendMessages} from "@src/language/friend/friend-messages/FriendMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** Playing a friend, in Korean. */
export const KOREAN_FRIEND_MESSAGES: FriendMessages = {
  signIn: {
    title: "친구 대국에 참여하려면 로그인하세요",
    body: "친구와 온라인으로 두려면 누가 누구인지 알 수 있도록 Google 계정이 필요합니다. 로그인하면 바로 친구의 대국으로 이동합니다.",
    confirm: "Google로 로그인",
    dismiss: "나중에",
  },
  strip: {
    connection: {connecting: "연결 중…", connected: "연결됨", reconnecting: "다시 연결 중…"},
    states: {
      idle: "",
      "waiting-for-a-friend": "친구가 들어오기를 기다리는 중",
      "choosing-setups": "상차림을 고르는 중",
      playing: "대국 중",
      "opponent-left": "친구가 나갔습니다. 대국은 친구를 위해 보관됩니다",
      over: "대국 종료",
    },
    youResigned: "내가 기권했습니다",
    opponentResigned: name => `${name}님이 기권했습니다`,
    friendResigned: "친구가 기권했습니다",
    youAre: side => `내 진영: ${koreanSideName(side)}`,
    backToGame: "이 대국으로 돌아가기",
    choose: "고르기",
    resign: "기권",
    leave: "나가기",
  },
  sheet: {
    title: "친구와 두기",
    closeLabel: "친구와 두기 닫기",
    reaching: "방에 연결하는 중…",
    waiting: "친구를 기다리는 중입니다. 코드를 알려 주거나 링크를 보내세요.",
    leaveRoom: "이 방에서 나가기",
  },
  makeCode: {
    title: "코드 만들기",
    chooseArmy: "내 진영을 고르세요. 친구는 다른 진영으로 둡니다.",
    sides: {cho: "초 (먼저 둠)", han: "한 (나중에 둠)"},
    create: "코드 만들기",
    failed: "지금은 코드를 만들 수 없습니다. 잠시 후 다시 시도해 주세요.",
  },
  enterCode: {
    title: "코드를 입력해 방에 들어가기",
    codeLabel: "친구의 코드",
    join: "들어가기",
    refused: "그 코드의 대국이 없습니다. 친구에게 코드를 확인해 보세요.",
  },
  codeGiven: {yourCode: "내 코드", linkCopied: "링크를 복사했습니다", copyLink: "보낼 링크 복사"},
  setup: {
    playing: opponent => `상대: ${opponent}`,
    choose: side => `내 진영(${koreanSideName(side)}) 상차림을 고르세요. 친구가 고르는 상차림은 보이지 않습니다.`,
    chose: setup => `${setup}을 골랐습니다. 친구가 고르기를 기다리는 중입니다.`,
  },
};
