import {addressOfGuide} from "@src/language/address/AddressOfGuide";
import {addressOfLanguage} from "@src/language/address/AddressOfLanguage";
import {addressOfReferences} from "@src/language/address/AddressOfReferences";
import type {GuideLinks} from "@src/react/pages/learn/links/types/GuideLinks";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/**
 * Where each link in the guide goes. They are written from the root the app is served from rather than relative to the
 * page, since the Korean guide sits one folder down and a relative `icon.svg` would look for it there.
 */
export function guideLinksOf(language: LanguageName, base: string): GuideLinks {
  return {
    game: addressOfLanguage(language, base),
    references: addressOfReferences(language, base),
    icon: `${base}icon.svg`,
    guides: {en: addressOfGuide("en", base), ko: addressOfGuide("ko", base)},
  };
}
