import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";

/**
 * Whether the board marks the pieces the army to move may actually move.
 *
 * A named option rather than a bare boolean because the control it is chosen with is the same
 * picker the board style and the piece set use, and that shows an option's name on its button.
 * Carrying `shown` alongside the name is what keeps the page from deciding what a choice means by
 * comparing strings.
 */
export interface MovableHighlight {
  readonly name: MovableHighlightName;
  readonly shown: boolean;
}
