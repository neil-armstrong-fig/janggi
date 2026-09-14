/**
 * The one thing two layers share: the note the lead was last left on, so the echo can take it up.
 *
 * The lead layer writes it and the echo layer reads it; the conductor makes one and hands it to both.
 * Shared this way rather than through the conductor, so every other layer stays unaware of the rest.
 */
export interface PhraseMemory {
  degree: number;
}
