import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";

const shown: MovableHighlight = {name: "Shown", shown: true};
const hidden: MovableHighlight = {name: "Hidden", shown: false};

/**
 * The two settings for the movable-piece mark, and the one a player starts with.
 *
 * The default lives here beside the list rather than in `@janggi/shared`, which publishes only the
 * names — the same split as `DEFAULT_STYLE` and `DEFAULT_PIECE_STYLE`.
 */
export const MOVABLE_HIGHLIGHTS: readonly MovableHighlight[] = [shown, hidden];

export const DEFAULT_MOVABLE_HIGHLIGHT: MovableHighlight = shown;
