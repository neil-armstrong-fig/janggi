import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

export interface GuideHeaderMessages {
  /** The name of the link on the logo that leads into the game, for a screen reader. */
  readonly homeLabel: string;
  readonly logoAlt: string;
  readonly brand: string;
  readonly tagline: string;
  readonly navigationLabel: string;
  readonly pieces: string;
  readonly questions: string;
  readonly play: string;
  /** What the language switch is for, for a screen reader. */
  readonly languageLabel: string;
  /** Each language in itself, the same in every guide, so a reader who cannot read this one can find theirs. */
  readonly languageNames: Readonly<Record<LanguageName, string>>;
}
