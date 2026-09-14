import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";

/**
 * How much the board moves as a game is played — a player's own setting, like the board style.
 *
 * A named option rather than a bare boolean for the reason `MovableHighlight` is one: it is chosen
 * with the same picker, which shows an option's name on its button, and carrying `full` beside the
 * name keeps the page from deciding what a choice means by comparing strings.
 *
 * It governs the motion the game adds — flights, captures landing, shakes. The chrome's own gentle
 * transitions follow the device's reduced-motion setting directly, through CSS.
 */
export interface Effects {
  readonly name: EffectsName;
  readonly full: boolean;
}
