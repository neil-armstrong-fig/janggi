import type {GuideIntroductionMessages} from "@src/language/guide/guide-messages/types/GuideIntroductionMessages";

interface Props {
  readonly messages: GuideIntroductionMessages;
}

export function Introduction({messages}: Props): React.JSX.Element {
  return (
    <section
      id="what-is-janggi"
      className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28"
      data-testid="guide-section"
    >
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.eyebrow}</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {messages.heading}
      </h2>

      <div className="grid gap-6 text-base leading-relaxed text-wood/80 sm:text-lg md:grid-cols-2 md:gap-12">
        <p>
          {messages.game.before}
          <strong>{messages.game.marked}</strong>
          {messages.game.after}
        </p>

        <p>{messages.board}</p>
      </div>
    </section>
  );
}
