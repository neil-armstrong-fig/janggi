/**
 * How see-through the settings sheet's own panel is, as its slider shows it: a whole number from the
 * floor to fully opaque.
 *
 * The floor is not zero: below it the panel stops reading as a panel at all on a real phone, so there
 * is no "invisible" end to this slider the way there is a "silent" end to a `Volume`.
 */
export type Opacity = number;

/** The least anyone can choose — the mobile default before this slider existed. */
export const MINIMUM_OPACITY: Opacity = 80;

/** Fully opaque. */
export const FULL_OPACITY: Opacity = 100;

/** The midpoint, and where every player starts until they choose otherwise. */
export const DEFAULT_OPACITY: Opacity = 90;
