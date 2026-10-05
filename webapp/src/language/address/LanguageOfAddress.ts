import {DEFAULT_LANGUAGE, LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/**
 * The language a page's address says it is in — `/ko/` is Korean — or undefined for the page at the root,
 * which says nothing and leaves the choice to the player's own (`docs/seo.md`). `base` is where the app is
 * served from.
 */
export function languageOfAddress(pathname: string, base: string): LanguageName | undefined {
  for (const name of LANGUAGE_NAMES) {
    if (name === DEFAULT_LANGUAGE) continue;

    const folder = `${base}${name}`;
    if (pathname === folder || pathname.startsWith(`${folder}/`)) return name;
  }

  return undefined;
}
