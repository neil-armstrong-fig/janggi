/**
 * How the marks that help a player choose a move are drawn: the dots and rings on the points a piece in
 * hand may go to, the dashed ring on a piece of its own army it would land on, the ring on a piece that
 * may move, and the wash over the piece in hand.
 *
 * Two colours rather than one, because no single colour reads on every board: a hint is `colour` with a
 * hairline of `outline` round it, so the pair reads on pale wood and near-black alike. A style that
 * wants only one of them can set them the same.
 */
export interface HintsStyle {
  /** Any CSS colour. Each mark is drawn in a translucent tint of it, more or less loudly. */
  readonly colour: string;
  /** Any CSS colour, drawn as a thin edge round every mark in `colour`. */
  readonly outline: string;
  /** Any CSS colour, washed over the cell of the piece in hand. Give it some transparency. */
  readonly selection: string;
}
