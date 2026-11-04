import {addressOfLanguage} from "@src/language/address/AddressOfLanguage";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Where the guide is in a language: beside the game's page for that language, so `/learn.html` and `/ko/learn.html`. */
export function addressOfGuide(language: LanguageName, base: string): string {
  return `${addressOfLanguage(language, base)}learn.html`;
}
