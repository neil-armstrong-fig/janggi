import type {GuidePieceMessages} from "@src/language/types/guide/GuidePieceMessages";
import type {GuidePieceStyleMessages} from "@src/language/types/guide/GuidePieceStyleMessages";
import type {MarkedText} from "@src/language/types/guide/MarkedText";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {SentenceWithTwoLinks} from "@src/language/types/guide/SentenceWithTwoLinks";

export interface GuidePiecesMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly introduction: string;
  readonly styleLabel: string;
  readonly styleGroupLabel: string;
  readonly styles: GuidePieceStyleMessages;
  readonly pieces: Readonly<Record<PieceType, GuidePieceMessages>>;
  readonly valuesLabel: string;
  /** The traditional values of the pieces, with what they are called set in bold. */
  readonly values: MarkedText;
  /** Where the movement and values come from, linking the association's rules and this game's research. */
  readonly sources: SentenceWithTwoLinks;
}
