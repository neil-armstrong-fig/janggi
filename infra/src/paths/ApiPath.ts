import {existsSync} from "node:fs";
import {resolve} from "node:path";

/** Where the API package is, worked out from where this file is, so it does not depend on where a deploy was started from. */
const API_DIRECTORY = resolve(import.meta.dirname, "../../../api");

/**
 * The absolute path of something in the API package — its Worker's entry file, its migrations.
 *
 * Worked out from this file's own place in the workspace rather than from the directory the deploy was run in, which a
 * relative `"../api/..."` would depend on. And checked: a path that is not there is an error naming it, before Alchemy
 * has started to create anything, since a misspelt or moved path would otherwise fail halfway through a deploy.
 */
export function apiPath(...segments: readonly string[]): string {
  const path = resolve(API_DIRECTORY, ...segments);

  if (!existsSync(path)) {
    throw new Error(`The API's ${segments.join("/")} is not at ${path}: has the api package moved?`);
  }

  return path;
}
