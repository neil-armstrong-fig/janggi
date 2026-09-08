import type {PieceType} from "./PieceType.js";
import type {Side} from "./Side.js";

/**
 * A piece's identity as one string: the key a per-piece style override is stored under, and the
 * value the webapp marks a rendered piece with so a test can say which piece it is looking at.
 *
 * Spelled as a template literal so the 14 real combinations are the only ones that type-check — a
 * style override written for a piece that does not exist is a compile error rather than a silent
 * no-op.
 */
export type PieceKey = `${Side}-${PieceType}`;
