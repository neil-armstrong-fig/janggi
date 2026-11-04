import type {GuideQuestionsMessages} from "@src/language/types/guide/GuideQuestionsMessages";

interface Props {
  readonly messages: GuideQuestionsMessages;
}

export function Questions({messages}: Props): React.JSX.Element {
  return (
    <section id="questions" className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">{messages.eyebrow}</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {messages.heading}
      </h2>

      <div className="border-t border-wood/15">
        <details className="border-b border-wood/15 py-5" open>
          <summary className="cursor-pointer text-base font-bold">{messages.chineseChess.question}</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">{messages.chineseChess.answer}</p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">{messages.free.question}</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            {messages.free.answer.before}
            <strong>{messages.free.answer.marked}</strong>
            {messages.free.answer.after}
          </p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">{messages.firstMove.question}</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">{messages.firstMove.answer}</p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">{messages.passing.question}</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">{messages.passing.answer}</p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">{messages.computer.question}</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            {messages.computer.answer.before}
            <a
              className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
              data-testid="guide-fairy-stockfish-source"
              href="https://github.com/fairy-stockfish/Fairy-Stockfish"
            >
              {messages.computer.answer.marked}
            </a>
            {messages.computer.answer.after}
          </p>
        </details>
      </div>
    </section>
  );
}
