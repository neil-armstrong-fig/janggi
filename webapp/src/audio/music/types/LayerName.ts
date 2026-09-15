/**
 * The layers the music is built from: the waiting theme first, heard before a game is under way, then
 * the game's own layers in the order they enter — with the check theme last, standing apart from the
 * rest.
 *
 * `waiting` is a plucked 가야금 theme while a player sets a game up, and `bass` a low string that sets
 * the chord under it and under the game alike. The game's own music is in the manner of 산조: `solo` a
 * 가야금 playing motifs over the 장단, `janggu` the drum playing that 장단, and `answer` a 대금 breathing
 * long notes where the solo's phrases turn. `checkTheme` is a layer set of its own, in another mode and
 * at another pace, for while a general is attacked.
 */
export const LAYER_NAMES = ["waiting", "bass", "solo", "janggu", "answer", "checkTheme"] as const;

export type LayerName = (typeof LAYER_NAMES)[number];
