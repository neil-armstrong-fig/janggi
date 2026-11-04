import type {FontStackName} from "@janggi/shared/janggi/styles/FontStackName";
import type {PieceBodyShape} from "@janggi/shared/janggi/styles/PieceBodyShape";
import type {PieceGlyphKind} from "@janggi/shared/janggi/styles/PieceGlyphKind";
import type {WritingName} from "@janggi/shared/janggi/styles/WritingName";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/** The controls for a piece set. */
export interface PieceControlMessages {
  readonly body: string;
  readonly shape: string;
  readonly bodyShapes: Record<PieceBodyShape, string>;
  readonly size: string;
  readonly fill: string;
  readonly outline: string;
  readonly outlineWidth: string;
  readonly inlay: string;
  readonly inset: string;
  readonly colour: string;
  readonly width: string;
  readonly filled: string;
  readonly mark: string;
  readonly kind: string;
  readonly glyphKinds: Record<PieceGlyphKind, string>;
  readonly writing: string;
  readonly writings: Record<WritingName, string>;
  readonly pieceTypes: Record<PieceType, string>;
  readonly face: string;
  readonly fonts: Record<FontStackName, string>;
  readonly weight: string;
  readonly leaning: string;
  readonly lean: string;
  readonly drawings: string;
  readonly drawingsNote: string;
  readonly chooseSvg: string;
  readonly drawingFor: (pieceType: PieceType) => string;
  readonly handling: string;
  readonly heldShadow: string;
  readonly hoverOutline: string;
  readonly fileTooBig: string;
}
