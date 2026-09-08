import type {CharacterSet} from "@src/react/pages/game/components/board/piece-styles/types/CharacterSet";

/**
 * The same words, in the Korean alphabet — not a translation of the hanja but the same Korean word
 * spelled out. A player calls the horse *ma* either way; only 馬 has to be learned as a symbol,
 * where 마 can be sounded out on sight.
 *
 * The armies stay distinct exactly where they are distinct in hanja.
 */
export const HANGUL_CHARACTERS: CharacterSet = {
  general: {han: "한", cho: "초"},
  guard: "사",
  horse: "마",
  elephant: "상",
  chariot: "차",
  cannon: "포",
  soldier: {han: "병", cho: "졸"},
};
