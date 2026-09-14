/**
 * Keeps `value` on the device as JSON under `key`. A storage that is full, blocked or missing is
 * shrugged off: what could not be written is lost at the next reload, which is still better than a game
 * that stops working.
 */
export function saveJson(storage: Pick<Storage, "setItem"> | undefined, key: string, value: unknown): void {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // Nothing to be done from here; see above.
  }
}
