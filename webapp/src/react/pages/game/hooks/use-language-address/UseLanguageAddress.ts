import {addressOfLanguage} from "@src/language/address/AddressOfLanguage";
import {DEFAULT_LANGUAGE} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {languageOfAddress} from "@src/language/address/LanguageOfAddress";
import {useEffect} from "react";

/**
 * Keeps the address bar on the page for the language the game is read in — `/` for English, `/ko/` for Korean —
 * so a link copied from it opens the game in the same language, and a reload keeps it (`docs/seo.md`). The
 * address is rewritten in place, with no reload, so choosing a language never closes what is open; the query and
 * hash stay, so a friend's `?join=` link survives.
 */
export function useLanguageAddress(language: LanguageName): void {
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const {pathname, search, hash} = globalThis.location;
    if ((languageOfAddress(pathname, base) ?? DEFAULT_LANGUAGE) === language) return;

    globalThis.history.replaceState(
      globalThis.history.state,
      "",
      `${addressOfLanguage(language, base)}${search}${hash}`,
    );
  }, [language]);
}
