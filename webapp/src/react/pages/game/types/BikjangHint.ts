import type {BikjangHintName} from "@janggi/shared/janggi/settings/BikjangHintName";

/**
 * Whether a move that would leave the opponent a bikjang to call is labelled 빅장 on the board.
 *
 * A named option rather than a bare boolean for the reason `MovableHighlight` is one — the picker it is
 * chosen with shows an option's name on its button — and `shown` is carried beside the name so the page
 * never decides what a choice means by comparing strings.
 *
 * This is what the player asked for, and only that: whether the label is drawn also depends on who the
 * opponent is. `bikjangHintShown` puts the two together.
 */
export interface BikjangHint {
  readonly name: BikjangHintName;
  readonly shown: boolean;
}
