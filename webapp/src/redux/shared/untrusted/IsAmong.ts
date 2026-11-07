/**
 * Whether a value read from outside is one of a list's members — how a stored name is checked against
 * the vocabulary it claims to use, rather than cast into it.
 */
export function isAmong<Member>(members: readonly Member[], value: unknown): value is Member {
  return members.some(member => member === value);
}
