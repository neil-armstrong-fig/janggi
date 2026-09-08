import type {CharacterSet} from "@src/react/pages/game/components/board/piece-styles/types/CharacterSet";
import type {Piece} from "@janggi/shared/janggi/pieces/Piece";

/**
 * The character a set writes on one piece.
 *
 * Most pieces are labelled the same by both armies, so a set names them once; the general and the
 * soldier are not, and name each army separately. Which of the two a set chose is its own business
 * rather than something a caller has to ask about first.
 */
export function characterFor(characters: CharacterSet, {side, type}: Piece): string {
  const character = characters[type];
  if (typeof character === "string") return character;

  return character[side];
}
