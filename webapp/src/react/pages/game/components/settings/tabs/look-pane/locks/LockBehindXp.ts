/**
 * Why something priced in XP may not be had yet — what it costs, as a picker shows it — or undefined
 * once the player has that much.
 */
export function lockBehindXp(price: number, xp: number): string | undefined {
  return xp >= price ? undefined : `${price.toLocaleString("en")} XP`;
}
