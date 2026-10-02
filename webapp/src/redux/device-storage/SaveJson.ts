/** The keys already reported as unwritable this page load, so a full storage is said once and not on every move. */
const reported = new Set<string>();

/**
 * Keeps `value` on the device as JSON under `key`. A storage that is full or refuses the write is shrugged off as
 * far as play goes — what could not be written is lost at the next reload, which is still better than a game that
 * stops working — **but it is said, in the console, once per key**: a value that quietly stopped being kept is the
 * kind of thing that is only found when somebody's record has gone.
 *
 * A device with no storage at all is not an error worth saying: a private window or blocked site data is a choice.
 */
export function saveJson(storage: Pick<Storage, "setItem"> | undefined, key: string, value: unknown): void {
  if (!storage) return;

  const text = JSON.stringify(value);

  try {
    storage.setItem(key, text);
  } catch (error) {
    if (reported.has(key)) return;

    reported.add(key);
    console.error(
      `Could not keep ${key} on this device (${Math.ceil(text.length / 1024)} KB): the storage is full or refusing writes. ` +
        "It will be lost when the page is closed.",
      error,
    );
  }
}
