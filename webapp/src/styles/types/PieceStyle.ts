import type {CharacterSet} from "@src/styles/types/CharacterSet";
import type {PictographSet} from "@src/styles/types/PictographSet";

/**
 * How one piece is painted: a body, a mark on it, and how big it is.
 *
 * Data, deliberately — the same schema the cell styles use, and for the same reason. A style has to
 * survive being written to storage, exported, shared and edited by a settings screen, so nothing
 * here is a component, a class name or a function.
 */
export interface PieceStyle {
  readonly body: PieceBodyStyle;
  readonly glyph: PieceGlyphStyle;
  /**
   * The piece's diameter as a fraction of the cell's height, so a piece is measured against the gap
   * between two intersections rather than against the screen. Traditional sets give the higher
   * ranks larger pieces, which is what `PieceSetStyle.pieces` is for.
   */
  readonly size: number;
}

/** The disc, or octagon, the mark is put on. */
export interface PieceBodyStyle {
  readonly shape: PieceBodyShape;
  /** Any SVG paint — a colour, or a `url(#...)` gradient a style has defined. */
  readonly fill: string;
  readonly stroke: string;
  readonly strokeWidth: number;
  /** A second outline drawn inside the first: the bevel on a turned wooden piece, or a ring. */
  readonly inlay?: PieceInlayStyle;
}

/** Listed as well as typed, because a set somebody else wrote has its shape checked against the list. */
export const PIECE_BODY_SHAPES = ["octagon", "disc"] as const;

export type PieceBodyShape = (typeof PIECE_BODY_SHAPES)[number];

export interface PieceInlayStyle {
  /** How far inside the body's edge the inlay sits, as a fraction of the piece's radius. */
  readonly inset: number;
  readonly stroke: string;
  readonly strokeWidth: number;
  /** Omit to let the body's own fill show through. */
  readonly fill?: string;
}

/**
 * What is marked on the piece, and the whole point of shipping more than one set: a `character` is
 * what is written on a real board, and a `pictograph` draws the thing the piece is named after so
 * the game is playable by someone who reads neither script.
 *
 * Each carries the marks themselves rather than naming a set the app has to know about, so a style
 * someone writes can bring its own characters or its own drawings and needs no code to support it.
 */
export type PieceGlyphStyle = CharacterGlyphStyle | PictographGlyphStyle;

/** Listed as well as typed, because a set somebody else wrote has its shape checked against the list. */
export const PIECE_GLYPH_KINDS = ["character", "pictograph"] as const;

export type PieceGlyphKind = (typeof PIECE_GLYPH_KINDS)[number];

export interface CharacterGlyphStyle {
  readonly kind: "character";
  readonly characters: CharacterSet;
  readonly colour: string;
  /** Cap height as a fraction of the piece's diameter. */
  readonly scale: number;
  /**
   * A full CSS font stack. Nothing is bundled, so end it in `serif` or `sans-serif` and expect a
   * device with no CJK font of its own to fall back to something plainer than the style intends.
   */
  readonly fontFamily: string;
  readonly fontWeight: number;
  /**
   * Traditional sets cut Han's characters in regular script and Cho's in cursive. No cursive face
   * can be assumed present, so a style that wants the distinction leans the character instead — an
   * approximation, and an honest one, rather than a promise the fallback font cannot keep.
   */
  readonly slant?: number;
}

export interface PictographGlyphStyle {
  readonly kind: "pictograph";
  readonly pictographs: PictographSet;
  readonly colour: string;
  /** The drawing's size as a fraction of the piece's diameter. */
  readonly scale: number;
}
