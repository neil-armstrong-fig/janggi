/** The exception class name safe to retain in an event, without its message or stack. */
export function errorNameOf(error: unknown): string {
  if (!(error instanceof Error)) return "UnknownError";

  const errorConstructor: unknown = Object.getPrototypeOf(error)?.constructor;
  if (typeof errorConstructor !== "function") return "Error";

  return errorConstructor.name;
}
