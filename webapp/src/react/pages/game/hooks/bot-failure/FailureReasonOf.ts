/** What went wrong, in words the player can be shown, from whatever a failed start or search threw. */
export function failureReasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
