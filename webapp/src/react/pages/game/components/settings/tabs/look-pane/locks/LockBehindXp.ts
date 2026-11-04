/**
 * Why something priced in XP may not be had yet — what it costs, as a picker shows it — or undefined
 * once the player has that much.
 */
export function lockBehindXp(price: number, xp: number, locale: string): string | undefined {
  if (xp >= price) {
    return undefined;
  }

  return `${price.toLocaleString(locale)} XP`;
}
