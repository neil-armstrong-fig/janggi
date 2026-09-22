export function Winning(): React.JSX.Element {
  return (
    <section className="border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">02 · The objective</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">How to win</h2>

      <div className="grid gap-6 text-base leading-relaxed text-wood/80 sm:text-lg md:grid-cols-2 md:gap-12">
        <p>
          Players alternate turns, moving one piece or choosing to pass. You win by <strong>checkmating</strong> the
          opposing general: attack it in a position where the other player has no legal move that removes the threat. A
          move that leaves your own general attacked is not legal.
        </p>

        <p>
          Captures happen by moving onto an enemy piece. Unlike chess, stalemate does not end a Janggi game because a
          player may skip a turn. In this app, two passes in a row stop the game and the points from the pieces still on
          the board decide the result.
        </p>
      </div>
    </section>
  );
}
