import type {BeatenLadders} from "./BeatenLadders.js";

/** The version written into new save keys. */
export const LATEST_SAVE_VERSION = 1;

/**
 * Exactly what a save key carries, and the one place its field names are written.
 *
 * **Plain on purpose, and public on purpose.** A player is meant to decode a key, change a number and
 * paste it back — that is the honest route to the Hacker theme — so this is the documentation for what
 * they will find in there. Nothing in it is worth hiding: it sets numbers on their own device.
 *
 * **Shared, so the app and its acceptance tests cannot disagree about it.** The webapp's `SaveBuilder`
 * writes it and `saveFrom` reads it; the acceptance tests build their saves against it too. A field
 * renamed here fails to compile in both packages at once, rather than leaving a spec pasting a key the
 * app no longer reads.
 *
 * The styles a save carries are the webapp's to describe — `CustomStyles` — because their shape is the
 * style schema, which the webapp alone draws. Everything else is fixed here.
 *
 * **`v` is the literal 1 rather than a number**, so this describes one shape and only that one. A change
 * that would make a reader misread an older key gets another interface carrying `v: 2`, and the shared
 * export becomes a union of both versions for writing and reading — rather than this interface growing
 * optional fields whose history every writer and reader would then have to keep in mind.
 */
export interface SaveKeyJson<CustomStyles> {
  readonly v: typeof LATEST_SAVE_VERSION;
  readonly xp: number;
  readonly beaten: BeatenLadders;
  readonly customStyles: CustomStyles;
}
