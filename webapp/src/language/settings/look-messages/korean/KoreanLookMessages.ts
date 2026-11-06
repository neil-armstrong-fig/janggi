import type {LookMessages} from "@src/language/settings/look-messages/LookMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The Look tab, in Korean. */
export const KOREAN_LOOK_MESSAGES: LookMessages = {
  board: "판",
  pieces: "말",
  boardOf: side => `${koreanSideName(side)} 판`,
  piecesOf: side => `${koreanSideName(side)} 말`,
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
  opponentLook: "상대의 판과 말 보기",
  opponentLookHelp:
    "온라인 대국 전용입니다. 상대의 판과 말로 대국을 보여 주고, 내 판과 말도 상대에게 공유합니다. 끄면 내 화면 설정을 씁니다.",
};
