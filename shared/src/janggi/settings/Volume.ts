/**
 * How loud one kind of sound is — the sound effects or the music — as its slider shows it: a whole
 * number from muted to full. A volume rather than on and off, because a player who wants the music
 * quieter than the clack of a piece should not have to choose between it and silence.
 */
export type Volume = number;

export const MUTED_VOLUME: Volume = 0;

/** As loud as the game goes, and where both kinds of sound start. */
export const FULL_VOLUME: Volume = 100;
