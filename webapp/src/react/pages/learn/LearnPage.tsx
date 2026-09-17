import {Closing} from "@src/react/pages/learn/components/closing/Closing";
import {DistinctiveRules} from "@src/react/pages/learn/components/distinctive-rules/DistinctiveRules";
import {Hero} from "@src/react/pages/learn/components/hero/Hero";
import {Introduction} from "@src/react/pages/learn/components/introduction/Introduction";
import {MatchFormats} from "@src/react/pages/learn/components/match-formats/MatchFormats";
import {Pieces} from "@src/react/pages/learn/components/pieces/Pieces";
import {Questions} from "@src/react/pages/learn/components/questions/Questions";
import {SiteFooter} from "@src/react/pages/learn/components/site-footer/SiteFooter";
import {SiteHeader} from "@src/react/pages/learn/components/site-header/SiteHeader";
import {Winning} from "@src/react/pages/learn/components/winning/Winning";

export function LearnPage(): React.JSX.Element {
  return (
    <div className="h-dvh overflow-y-auto scroll-smooth bg-ground text-wood motion-reduce:scroll-auto">
      <a
        className="fixed top-3 left-3 z-10 -translate-y-[200%] rounded-lg bg-gold px-4 py-2 font-bold text-ink focus:translate-y-0 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
        href="#guide"
      >
        Skip to the guide
      </a>

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
        <SiteHeader />

        <main id="guide" data-testid="guide" data-guide-ready="true">
          <Hero />

          <Introduction />

          <Winning />

          <Pieces />

          <DistinctiveRules />

          <MatchFormats />

          <Questions />

          <Closing />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
