/**
 * Whether a move that would leave the opponent a bikjang to call is labelled 빅장 on the board.
 *
 * Named for what a player sees rather than for a boolean, for the reason `MovableHighlightName` is: the
 * picker it is chosen with shows the option's name on the button. "Shown" is the default. Choosing it
 * is not a promise the label appears — against the stronger bots it never does, which is the webapp's
 * to decide and not a preference's.
 */
export const BIKJANG_HINT_NAMES = ["Shown", "Hidden"] as const;

export type BikjangHintName = (typeof BIKJANG_HINT_NAMES)[number];
