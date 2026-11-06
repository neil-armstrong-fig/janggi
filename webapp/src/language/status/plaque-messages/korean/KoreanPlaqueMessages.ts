import type {PlaqueMessages} from "@src/language/status/plaque-messages/PlaqueMessages";
import {koreanSideName} from "@src/language/sides/korean/KoreanSideName";

/** The players' plaques, in Korean. */
export const KOREAN_PLAQUE_MESSAGES: PlaqueMessages = {
  bot: "봇",
  player: "나",
  takenFrom: side => `${koreanSideName(side)} 진영의 잡힌 말`,
  nextUnlock: (xp, unlocks) => `다음 해금: ${xp} XP, ${unlocks}`,
};
