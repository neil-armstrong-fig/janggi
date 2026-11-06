import type {PlaqueMessages} from "@src/language/status/plaque-messages/PlaqueMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The players' plaques, in English. */
export const ENGLISH_PLAQUE_MESSAGES: PlaqueMessages = {
  bot: "Bot",
  player: "You",
  takenFrom: side => `Taken from ${englishSideName(side)}`,
  nextUnlock: (xp, unlocks) => `Next unlock: ${xp} XP, unlock ${unlocks}`,
};
