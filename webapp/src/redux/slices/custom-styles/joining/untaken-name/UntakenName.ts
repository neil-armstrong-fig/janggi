/**
 * `name` where nothing else answers to it, and otherwise `name` with a number after it — "Midnight",
 * then "Midnight (2)", then "Midnight (3)".
 *
 * A style is picked out by its name: it is what a picker shows, what a preference holds, and what a spec
 * asks for. Two styles under one name would leave the player unable to say which they meant, so an
 * arriving style is renamed rather than refused — somebody who imported two of a friend's styles should
 * get both, not an error about the second.
 */
export function untakenName(name: string, taken: readonly string[]): string {
  let candidate = name;

  for (let count = 2; taken.includes(candidate); count++) {
    candidate = `${name} (${count})`;
  }

  return candidate;
}
