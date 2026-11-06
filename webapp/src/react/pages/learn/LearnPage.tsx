import {Closing} from "@src/react/pages/learn/components/closing/Closing";
import {DistinctiveRules} from "@src/react/pages/learn/components/distinctive-rules/DistinctiveRules";
import {guideLinksOf} from "@src/react/pages/learn/links/GuideLinksOf";
import {guideMessagesOf} from "@src/language/guide/GuideMessagesOf";
import {Hero} from "@src/react/pages/learn/components/hero/Hero";
import {Introduction} from "@src/react/pages/learn/components/introduction/Introduction";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {MatchFormats} from "@src/react/pages/learn/components/match-formats/MatchFormats";
import {Pieces} from "@src/react/pages/learn/components/pieces/Pieces";
import {Questions} from "@src/react/pages/learn/components/questions/Questions";
import {SiteFooter} from "@src/react/pages/learn/components/site-footer/SiteFooter";
import {SiteHeader} from "@src/react/pages/learn/components/site-header/SiteHeader";
import {TranslationNotice} from "@src/react/pages/components/translation-notice/TranslationNotice";
import {Winning} from "@src/react/pages/learn/components/winning/Winning";

interface Props {
  /** The language the guide is read in: its page chooses it, as the game's page does. */
  readonly language: LanguageName;
}

export function LearnPage({language}: Props): React.JSX.Element {
  const messages = guideMessagesOf(language);
  const links = guideLinksOf(language, import.meta.env.BASE_URL);

  return (
    <div className="h-dvh overflow-y-auto scroll-smooth bg-ground text-wood motion-reduce:scroll-auto">
      <a
        className="fixed top-3 left-3 z-10 -translate-y-[200%] rounded-lg bg-gold px-4 py-2 font-bold text-ink focus:translate-y-0 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
        href="#guide"
      >
        {messages.skipLink}
      </a>

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
        {messages.translationNotice && (
          <TranslationNotice messages={messages.translationNotice} originalAddress={links.guides.en} />
        )}

        <SiteHeader messages={messages.header} links={links} language={language} />

        <main id="guide" data-testid="guide" data-guide-ready="true">
          <Hero messages={messages.hero} links={links} />

          <Introduction messages={messages.introduction} />

          <Winning messages={messages.winning} />

          <Pieces messages={messages.pieces} />

          <DistinctiveRules messages={messages.rules} links={links} />

          <MatchFormats messages={messages.matchFormats} links={links} />

          <Questions messages={messages.questions} />

          <Closing messages={messages.closing} links={links} />
        </main>

        <SiteFooter messages={messages.footer} links={links} />
      </div>
    </div>
  );
}
