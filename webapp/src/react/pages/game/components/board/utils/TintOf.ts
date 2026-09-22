/**
 * A colour at a fraction of its strength — the same colour, more or less see-through — so a mark can be
 * loud or quiet in whatever colour its board style gave it. The browser does the mixing, which is what
 * lets `colour` be anything CSS reads: a hex, an `rgba()`, a named colour.
 */
export function tintOf(colour: string, percent: number): string {
  return `color-mix(in srgb, ${colour} ${percent}%, transparent)`;
}
