import type {CharacterSet} from "@src/react/pages/game/components/board/piece-styles/types/CharacterSet";

/**
 * The characters cut into a real set.
 *
 * A level above the sets rather than inside one, because both Traditional and Hanja write these:
 * a mark set beside a set belongs to it, and one here is shared. Nothing about 漢 or 卒 should have
 * two copies that can disagree.
 *
 *
 * Only two of the seven differ between the armies, and neither difference is decoration: the
 * generals carry the names of the rival states 漢 and 楚 that the game is a retelling of, and the
 * foot soldiers are Han's 兵 against Cho's 卒 — two words for a soldier, 卒 the lowlier of them.
 */
export const HANJA_CHARACTERS: CharacterSet = {
  general: {han: "漢", cho: "楚"},
  guard: "士",
  horse: "馬",
  elephant: "象",
  chariot: "車",
  cannon: "包",
  soldier: {han: "兵", cho: "卒"},
};
