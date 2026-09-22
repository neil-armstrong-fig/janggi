/**
 * How a board marks the two points the last move went between.
 *
 * Part of the board style rather than one mark for every board, because no single colour reads on
 * both: the warm wash that was once the only mark all but vanished into Classic's pale wood, while the
 * same wash stood out on Neon. Lichess has the same complaint about its one last-move colour on some
 * of its boards, and chess.com gives each of its themes its own.
 *
 * Two parts, because a janggi piece covers most of its point. The wash fills the whole cell and shows
 * plainly where the piece left, but under the piece that arrived only a sliver of it is visible. The
 * brackets sit in the cell's corners, the one part of it no piece reaches, so the point the piece
 * went to is marked however large the set draws it — the corner mark xiangqi boards have long used.
 */
export interface LastMoveStyle {
  /** Any CSS colour, washed over both points. Give it some transparency, or it hides the lines. */
  readonly wash: string;
  /** Any CSS colour, for the brackets in the corners of both points. */
  readonly brackets: string;
}
