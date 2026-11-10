/** The signed Elo difference between a finished game's before and after ratings. */
export function eloChange(change: number): string {
  if (change > 0) return `+${change}`;
  if (change < 0) return `−${Math.abs(change)}`;
  return "0";
}
