/** The origins allowed to call the API with credentials, from the comma-separated setting: each trimmed, and none empty. */
export function originsFrom(setting: string): readonly string[] {
  return setting
    .split(",")
    .map(origin => origin.trim())
    .filter(origin => origin !== "");
}
