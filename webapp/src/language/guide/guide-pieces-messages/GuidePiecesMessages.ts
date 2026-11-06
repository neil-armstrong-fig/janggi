import type {GuidePieceMessages} from "@src/language/guide/guide-pieces-messages/types/GuidePieceMessages";
import type {MarkedText} from "@src/language/guide/types/MarkedText";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {SentenceWithTwoLinks} from "@src/language/types/SentenceWithTwoLinks";

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

/** What the three ways of drawing the example pieces are called on the buttons that choose between them. */
interface GuidePieceStyleMessages {
  readonly traditional: string;
  readonly hangul: string;
  readonly modern: string;
}
