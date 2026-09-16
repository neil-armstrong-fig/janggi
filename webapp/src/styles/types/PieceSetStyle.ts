import type {PieceKey} from "@janggi/shared/janggi/pieces/PieceKey";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** Overrides keyed by `toPieceKey`, e.g. `{"han-general": {...}}`. */
export type PieceOverrides = Readonly<Partial<Record<PieceKey, PieceStyle>>>;

/** The style each army wears where nothing more specific applies. */
export type SideStyles = Readonly<Record<Side, PieceStyle>>;

/**
 * How a whole set of pieces looks: one style per side, and any number of per-piece overrides.
 *
 * The board style's shape, one level up: a default that covers almost everything, plus a map for
 * the exceptions. A side is the default here rather than a single `defaultPiece` because the one
 * thing every set must vary is which army a piece belongs to — that is the only distinction a
 * player cannot play without.
 */
export interface PieceSetStyle {
  readonly name: string;
  readonly sides: SideStyles;
  /**
   * Typed as the 14 real keys, so an override written for a piece that does not exist fails to
   * compile rather than silently never matching.
   */
  readonly pieces?: PieceOverrides;
}
