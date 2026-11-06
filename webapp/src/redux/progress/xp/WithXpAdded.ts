/** `xp` with `earned` added, held at the largest whole number that stays exact, however much a hand-edited save starts from. */
export function withXpAdded(xp: number, earned: number): number {
  return Math.min(xp + earned, Number.MAX_SAFE_INTEGER);
}
