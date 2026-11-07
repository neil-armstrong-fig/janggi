/**
 * What the sync keeps about one of the player's own styles, beside the style rather than in it: the id that
 * follows it from device to device, and when it was last changed.
 *
 * A name is what the player and their preferences know a style by, but two devices can each make a "Mine", and a
 * style renamed is the same style — so the sync tells styles apart by id. Kept outside the style itself because a
 * style is also the key a player shares, and that wire format has no business carrying bookkeeping.
 */
export interface StyleStamp {
  readonly id: string;
  /** Milliseconds since the epoch, by this device's clock; a device whose clock is wrong can win or lose a tie it should not. */
  readonly at: number;
}
