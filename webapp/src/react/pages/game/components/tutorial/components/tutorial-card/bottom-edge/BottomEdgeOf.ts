/** How far in from the screen's edge the card stands, its `top-3`, and how far above the row of controls at the bottom. */
export const CARD_INSET = 12;

interface Standing {
  /** How far up from the bottom of the screen the row of controls reaches. */
  readonly controlsClearance: number;
  readonly viewportHeight: number;
}

/**
 * How far down the card's bottom stands, docked at the bottom, as its classes place it: above the row of controls on any
 * screen, so Settings is never under it.
 */
export function bottomEdgeOf({controlsClearance, viewportHeight}: Standing): number {
  return viewportHeight - controlsClearance - CARD_INSET;
}
