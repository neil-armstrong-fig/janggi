/** `localStorage`, where there is one to reach — reading the property itself throws where it is blocked. */
export function deviceStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
