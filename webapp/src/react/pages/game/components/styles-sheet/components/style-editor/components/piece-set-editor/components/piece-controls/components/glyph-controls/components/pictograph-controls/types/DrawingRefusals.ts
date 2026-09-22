import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/** What was wrong with the SVG last chosen for each kind of piece, for the kinds one was refused for. */
export type DrawingRefusals = Readonly<Partial<Record<PieceType, string>>>;
