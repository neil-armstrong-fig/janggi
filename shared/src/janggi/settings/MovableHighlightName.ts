/**
 * Whether the board marks the pieces their owner may move this turn.
 *
 * Named for what a player sees rather than for a boolean, because the picker it is chosen with
 * shows the option's name on the button. "Shown" is the default; the mark is broad in the opening,
 * where most of an army can move, and earns itself in check and against a pin.
 */
export const MOVABLE_HIGHLIGHT_NAMES = ["Shown", "Hidden"] as const;

export type MovableHighlightName = (typeof MOVABLE_HIGHLIGHT_NAMES)[number];
