export function MatchFormats(): React.JSX.Element {
  return (
    <section className="border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">05 · Choose your match</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        Casual and scored Janggi
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <p className="mb-2 text-xs font-bold tracking-[0.19em] text-gold uppercase">Casual</p>

          <h3 className="mb-2 text-base font-bold">The familiar online game</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            The armies begin in the common arrangement and can be rearranged before the first move. A called bikjang
            ends the game as a draw, and so does an agreed draw or, once both sides are under 30 points, the same
            position standing a third time. This is the simplest format for learning and local play.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <p className="mb-2 text-xs font-bold tracking-[0.19em] text-gold uppercase">Scored</p>

          <h3 className="mb-2 text-base font-bold">The tournament reading</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            Han chooses an arrangement first, Cho responds and Han begins with an extra 1.5 points. Bikjang can normally
            be called only when both sides have fewer than 30 points left, and the result is decided on points. So is a
            game that goes round in circles under 30 points.
          </p>
        </article>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        This game supports both readings because published rules describe both formats. See the{" "}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href="references.html#rules"
        >
          rule sources and research notes
        </a>{" "}
        for the primary Korean sources and translations.
      </p>
    </section>
  );
}
