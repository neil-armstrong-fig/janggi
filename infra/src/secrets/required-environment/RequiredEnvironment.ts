/**
 * The value of each named variable, or a thrown error naming every one that is not set — all at once, so somebody
 * standing up the infrastructure for the first time learns what they are missing in one go rather than one deploy at a
 * time. An empty variable counts as not set.
 */
export function requiredEnvironment<Name extends string>(
  environment: Readonly<Record<string, string | undefined>>,
  names: readonly Name[],
): Record<Name, string> {
  const missing = names.filter(name => !environment[name]);

  if (missing.length > 0) {
    throw new Error(`Set ${missing.join(", ")} in the environment before deploying (see infra/AGENTS.md).`);
  }

  return Object.fromEntries(names.map(name => [name, environment[name]])) as Record<Name, string>;
}
