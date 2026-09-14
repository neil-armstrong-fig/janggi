/**
 * Whatever JSON is kept under `key` on the device, or undefined — where nothing is kept, where it will
 * not parse, where the storage refuses to be read (a private window, blocked site data), or where there
 * is no storage at all.
 *
 * What comes back is `unknown` on purpose. An older version of the app wrote it, or anybody with the
 * dev tools open, so whoever reads it checks every field before trusting it.
 */
export function readJson(storage: Pick<Storage, "getItem"> | undefined, key: string): unknown {
  try {
    const text = storage?.getItem(key);

    return text ? JSON.parse(text) : undefined;
  } catch {
    return undefined;
  }
}
