/**
 * The layers the music is built from, in the order they enter as a game grows tense — with the check
 * theme last, standing apart from the rest.
 *
 * The game's own music is in the manner of the slow court music 수제천: `drone` is the held ground,
 * `lead` a reed holding one long note to each beat of an uneven cycle, `pulse` sparse drum strokes
 * spread across that cycle, `echo` a flute answering the lead where it rests, and `percussion` the
 * fuller drumming of a fight at its height. `checkTheme` is a layer set of its own, in another mode and
 * at another pace, for while a general is attacked.
 */
export const LAYER_NAMES = ["drone", "lead", "pulse", "echo", "percussion", "checkTheme"] as const;

export type LayerName = (typeof LAYER_NAMES)[number];
