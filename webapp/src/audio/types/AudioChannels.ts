/**
 * How loud a player wants each of the two kinds of sound: the sound effects of the game itself, and
 * the music under it — each from 0, silent, to 1, full. Separate, because plenty of players want one
 * and not the other.
 */
export interface AudioChannels {
  readonly effects: number;
  readonly music: number;
}
