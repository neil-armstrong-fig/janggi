import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

/** Where the guide's links go, written as the page will write them, from the language it is read in. */
export interface GuideLinks {
  /** The game, in the guide's own language. */
  readonly game: string;
  /** The references page, which has no Korean twin. */
  readonly references: string;
  readonly icon: string;
  /** The guide in each language, which the switch offers and the translation notice sends back to the original. */
  readonly guides: Readonly<Record<LanguageName, string>>;
}
