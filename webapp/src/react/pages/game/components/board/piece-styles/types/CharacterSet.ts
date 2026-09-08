import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The two armies' own characters, where a set writes a piece differently for each of them. */
export type SideCharacters = Readonly<Record<Side, string>>;

/** A single character where both armies label a piece the same, and a pair where they do not. */
export type PieceCharacter = string | SideCharacters;

/**
 * What a set writes on each of the seven pieces.
 *
 * Data rather than a lookup buried in a component, because a character set is exactly the sort of
 * thing someone will want to supply: a different script, a regional variant, a translation. A style
 * carries the set it wants, and a user-authored style brings its own.
 */
export type CharacterSet = Readonly<Record<PieceType, PieceCharacter>>;
