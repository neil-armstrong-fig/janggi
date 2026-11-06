import type {GuideLinks} from "@src/react/pages/learn/links/types/GuideLinks";
import type {GuideMatchFormatsMessages} from "@src/language/guide/guide-messages/types/GuideMatchFormatsMessages";

interface Props {
  readonly messages: GuideMatchFormatsMessages;
  readonly links: GuideLinks;
}

export function MatchFormats({messages, links}: Props): React.JSX.Element {
  return (
    <section className="border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.eyebrow}</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {messages.heading}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <p className="mb-2 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.casual.label}</p>

          <h3 className="mb-2 text-base font-bold">{messages.casual.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.casual.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <p className="mb-2 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.scored.label}</p>

          <h3 className="mb-2 text-base font-bold">{messages.scored.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.scored.body}</p>
        </article>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        {messages.sources.before}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href={`${links.references}#rules`}
        >
          {messages.sources.marked}
        </a>
        {messages.sources.after}
      </p>
    </section>
  );
}
