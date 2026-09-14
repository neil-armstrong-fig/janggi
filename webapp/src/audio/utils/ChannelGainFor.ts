/**
 * How loud a channel plays at a volume, from 0 (silent) to 1 (full), given the level it plays at full.
 *
 * **Squared, not proportional.** Loudness is heard on a ratio, so a gain that tracked the slider
 * straight would crowd every audible change into the bottom of its travel and leave the top half
 * sounding the same. The square spreads it out: half-way is a quarter of the gain, which is heard as
 * roughly half as loud.
 */
export function channelGainFor(volume: number, fullLevel: number): number {
  return fullLevel * volume * volume;
}
