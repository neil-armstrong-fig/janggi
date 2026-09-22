export function Introduction(): React.JSX.Element {
  return (
    <section
      id="what-is-janggi"
      className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28"
      data-testid="guide-section"
    >
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">01 · The game</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        What is Janggi?
      </h2>

      <div className="grid gap-6 text-base leading-relaxed text-wood/80 sm:text-lg md:grid-cols-2 md:gap-12">
        <p>
          <strong>Janggi (장기)</strong>, usually called Korean chess in English, is a two-player strategy board game.
          It belongs to the same chess family as chess, xiangqi and shogi, but plays differently: an open board, long
          elephants, jumping cannons and active palace diagonals.
        </p>

        <p>
          Pieces stand on the intersections of nine vertical files and ten horizontal ranks. Cho’s blue-green army
          begins at the bottom and moves first; Han’s red army begins at the top and starts scored games with an extra
          1.5 points. Each general remains inside a three-by-three palace marked with diagonal lines.
        </p>
      </div>
    </section>
  );
}
