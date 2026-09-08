import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

/**
 * A drawing of each of the seven pieces, as SVG path data in the same 100-unit box the piece itself
 * is drawn in, filled with the non-zero rule.
 *
 * Data for the same reason a character set is: a style carries the drawings it wants, and nothing
 * about the app assumes the ones that ship with it are the only ones there will ever be.
 */
export type PictographSet = Readonly<Record<PieceType, string>>;
