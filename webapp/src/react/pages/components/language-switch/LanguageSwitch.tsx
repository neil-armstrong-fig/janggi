import clsx from "clsx";
import {LANGUAGE_NAMES} from "@janggi/shared/janggi/settings/LanguageName";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

interface Props {
  /** The language the page is in: marked, and the one pressing the switch leaves. */
  readonly current: LanguageName;
  /** What the switch is for, for a screen reader. */
  readonly label: string;
  /** Each language in itself, so a reader who cannot read the page can find theirs. */
  readonly names: Readonly<Record<LanguageName, string>>;
  /** Where the same page is in each language. */
  readonly addresses: Readonly<Record<LanguageName, string>>;
}

/**
 * Toggles a reading page, the guide or the references, between its languages. The whole switch is one plain link to the
 * other language, so pressing either name moves the page, it works without a script, and a crawler can follow it. Each
 * language is named in itself. A screen reader hears the link as where it goes, not as both names.
 */
export function LanguageSwitch({current, label, names, addresses}: Props): React.JSX.Element {
  const other = LANGUAGE_NAMES.find(language => language !== current) ?? current;

  return (
    <div className="flex items-center text-sm" role="group" aria-label={label}>
      <a
        className="flex items-center rounded-full border border-gold/50 p-0.5 no-underline select-none hover:bg-wood/10 focus:outline-2 focus:outline-offset-2 focus:outline-gold"
        aria-label={names[other]}
        href={addresses[other]}
        hrefLang={other}
        lang={other}
      >
        {LANGUAGE_NAMES.map(language => (
          <span
            key={language}
            className={clsx(
              "inline-flex min-h-8 items-center rounded-full px-3",
              language === current && "bg-gold font-bold text-ink",
            )}
            data-current={language === current}
            data-language={language}
            data-testid={`page-language-${language}`}
            lang={language}
          >
            {names[language]}
          </span>
        ))}
      </a>
    </div>
  );
}
