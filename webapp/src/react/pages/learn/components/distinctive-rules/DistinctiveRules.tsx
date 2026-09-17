export function DistinctiveRules(): React.JSX.Element {
  return (
    <section className="border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">04 · What makes it different</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        Rules unique to Janggi
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">There is no river</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            The full board is open from the start. Soldiers can move sideways immediately, and elephants may cross
            freely into the opposing half.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">Cannons must jump</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            A cannon must jump exactly one piece even for an ordinary move. It cannot jump over another cannon, and one
            cannon can never capture another.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">Palaces have active diagonals</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            Generals and guards use their own palace lines. Chariots and cannons can use the diagonals in either palace,
            while invading soldiers can step diagonally forward.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">You choose the opening arrangement</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            Before play, each army chooses how its two horses and two elephants alternate on the back rank. The four
            standard arrangements change which side of the board develops first.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">You may pass</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            Skipping a turn is a normal part of Janggi, except while your general is in check. This is why the game has
            no stalemate ending.
          </p>
        </article>

        <article className="rounded-xl border border-wood/15 bg-ground-raised/60 p-6">
          <h3 className="mb-2 text-base font-bold">Facing generals create bikjang</h3>

          <p className="text-sm leading-relaxed text-wood/70">
            When the two generals face down an open file, a player may call <i>bikjang</i> (빅장). What that call
            decides depends on the match format.
          </p>
        </article>
      </div>

      <p className="mt-4 border-l-3 border-gold bg-gold/5 px-5 py-4 text-wood/80">
        The{" "}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href="references.html#rules"
        >
          rules and match sources
        </a>{" "}
        cover palace lines, cannons, passing and bikjang. The{" "}
        <a
          className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
          href="references.html#openings"
        >
          opening research
        </a>{" "}
        explains how the four starting arrangements were compared and named.
      </p>
    </section>
  );
}
