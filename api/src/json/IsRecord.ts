/** Whether something read from outside is an object with keys to look up — not null, and not a list. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
