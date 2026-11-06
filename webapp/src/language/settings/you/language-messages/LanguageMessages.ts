import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** The language picker's own words. Each language is named in itself, so a player can find theirs without reading the rest. */
export interface LanguageMessages {
  readonly label: string;
  readonly names: Record<LanguageName, string>;
}
