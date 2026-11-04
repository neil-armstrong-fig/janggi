import type {GuideHeaderMessages} from "@src/language/types/guide/GuideHeaderMessages";
import type {GuideLinks} from "@src/react/pages/learn/links/types/GuideLinks";
import {LanguageSwitch} from "@src/react/pages/components/language-switch/LanguageSwitch";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";

interface Props {
  readonly messages: GuideHeaderMessages;
  readonly links: GuideLinks;
  /** The language the guide is in, which the switch marks. */
  readonly language: LanguageName;
}

export function SiteHeader({messages, links, language}: Props): React.JSX.Element {
  return (
    <header
      className="flex min-h-21 flex-wrap items-center gap-x-4 gap-y-2 border-b border-wood/15 py-2 sm:gap-x-5"
      data-testid="guide-header"
    >
      <a
        className="inline-flex items-center gap-3 no-underline"
        data-testid="guide-header-title"
        href={links.game}
        aria-label={messages.homeLabel}
      >
        <img src={links.icon} width="52" height="52" alt={messages.logoAlt} />

        <span className="block">
          <b className="block text-base tracking-wide">{messages.brand}</b>

          <small className="hidden text-xs text-wood/65 sm:block">{messages.tagline}</small>
        </span>
      </a>

      <nav className="ml-auto hidden items-center gap-5 text-sm md:flex" aria-label={messages.navigationLabel}>
        <a className="underline decoration-wood/35 underline-offset-4" href="#pieces">
          {messages.pieces}
        </a>

        <a className="underline decoration-wood/35 underline-offset-4" href="#questions">
          {messages.questions}
        </a>
      </nav>

      <div className="ml-auto md:ml-0">
        <LanguageSwitch
          current={language}
          label={messages.languageLabel}
          names={messages.languageNames}
          addresses={links.guides}
        />
      </div>

      <a
        className="w-full rounded-full border border-gold/50 px-4 py-2 text-center text-sm no-underline hover:bg-wood/10 focus:outline-2 focus:outline-offset-4 focus:outline-gold sm:w-auto"
        data-testid="guide-header-play"
        href={links.game}
      >
        {messages.play}
      </a>
    </header>
  );
}
