import type {GuideRulesMessages} from "@src/language/types/guide/GuideRulesMessages";
import type {GuideLinks} from "@src/react/pages/learn/links/types/GuideLinks";

interface Props {
  readonly messages: GuideRulesMessages;
  readonly links: GuideLinks;
}

export function DistinctiveRules({messages, links}: Props): React.JSX.Element {
  return (
    <section className="border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.eyebrow}</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {messages.heading}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.noRiver.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.noRiver.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.cannons.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.cannons.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.palaces.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.palaces.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.openings.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.openings.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.passing.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">{messages.passing.body}</p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">{messages.bikjang.title}</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            {messages.bikjang.body.before}
            <i>{messages.bikjang.body.marked}</i>
            {messages.bikjang.body.after}
          </p>
        </article>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        {messages.sources.start}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href={`${links.references}#rules`}
        >
          {messages.sources.firstLink}
        </a>
        {messages.sources.middle}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href={`${links.references}#openings`}
        >
          {messages.sources.secondLink}
        </a>
        {messages.sources.end}
      </p>
    </section>
  );
}
