/** The secrets the API cannot answer without. */
const REQUIRED = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] as const;

/**
 * The names of the secrets that are not set, or are empty — none where the API is ready. Taken as an object of
 * strings rather than the Worker's environment, which only exists inside the Workers runtime, so it can be tested.
 */
export function missingSecrets(environment: Readonly<Partial<Record<(typeof REQUIRED)[number], string>>>): string[] {
  return REQUIRED.filter(name => !environment[name]);
}
