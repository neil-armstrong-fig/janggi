import type {GuideFooterMessages} from "@src/language/types/guide/GuideFooterMessages";
import type {GuideLinks} from "@src/react/pages/learn/links/types/GuideLinks";

interface Props {
  readonly messages: GuideFooterMessages;
  readonly links: GuideLinks;
}

export function SiteFooter({messages, links}: Props): React.JSX.Element {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-wood/15 py-8 text-sm text-wood/60 sm:flex-row sm:items-center sm:pb-12">
      <p>{messages.brand}</p>

      <nav className="flex flex-wrap items-center gap-5" aria-label={messages.navigationLabel}>
        <a className="underline decoration-wood/35 underline-offset-4" href={links.game}>
          {messages.play}
        </a>

        <a
          className="underline decoration-wood/35 underline-offset-4"
          data-testid="guide-references"
          href={links.references}
        >
          {messages.sources}
        </a>

        <a
          className="underline decoration-wood/35 underline-offset-4"
          href="https://github.com/neil-armstrong-fig/janggi"
        >
          {messages.sourceCode}
        </a>
      </nav>
    </footer>
  );
}
