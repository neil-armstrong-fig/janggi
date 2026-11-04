import {addressOfLanguage} from "@src/language/address/AddressOfLanguage";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Where the references are in a language: beside the game's page for that language. */
export function addressOfReferences(language: LanguageName, base: string): string {
  return `${addressOfLanguage(language, base)}references.html`;
}
