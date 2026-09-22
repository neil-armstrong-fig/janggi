/** How a piece answers being touched: the shadow it casts lifted in hand, and how its outline thickens under the pointer. */
export interface PieceHandlingStyle {
  /** Any CSS colour, cast under a piece held in hand. */
  readonly shadow: string;
  /**
   * What its outlines are multiplied by under the pointer, so a set of hairlines and one of heavy edges both
   * thicken alike: enough to read as deliberate at a glance, and not so much that a heavy set turns into a blob.
   */
  readonly hoverOutline: number;
}
