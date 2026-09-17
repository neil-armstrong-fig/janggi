export function Questions(): React.JSX.Element {
  return (
    <section id="questions" className="scroll-mt-4 border-t border-wood/15 py-16 lg:py-28" data-testid="guide-section">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">06 · Quick answers</p>

      <h2 className="mb-7 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        Janggi questions
      </h2>

      <div className="border-t border-wood/15">
        <details className="border-b border-wood/15 py-5" open>
          <summary className="cursor-pointer text-base font-bold">Is Janggi the same as Chinese chess?</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            No. Janggi and Chinese xiangqi are relatives, but Janggi has no river, uses longer elephant moves, lets
            soldiers move sideways immediately and gives cannons, palaces and opening arrangements different rules.
          </p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">Can I play Janggi online for free?</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            Yes. This browser game is free, needs no account and lets you play a friend or choose from eight computer
            strengths. On your phone, choose <strong>Save to this device</strong> near the top of this page. You can
            then play even when you are offline.
          </p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">Who moves first in Janggi?</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            Cho, the blue-green army, moves first. In scored play Han receives 1.5 points for moving second.
          </p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">Can a player skip a turn?</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            Yes. Passing is legal unless the general is in check. In this game, two passes in a row end the game and the
            points from the pieces still on the board decide the winner.
          </p>
        </details>

        <details className="border-b border-wood/15 py-5">
          <summary className="cursor-pointer text-base font-bold">Can I play Janggi against the computer?</summary>

          <p className="mt-3 max-w-4xl leading-relaxed text-wood/75">
            Yes. The built-in{" "}
            <a
              className="underline decoration-wood/35 underline-offset-4 hover:decoration-gold"
              data-testid="guide-fairy-stockfish-source"
              href="https://github.com/fairy-stockfish/Fairy-Stockfish"
            >
              Fairy-Stockfish
            </a>{" "}
            opponent has eight strengths from beginner to expert. You can play either Cho or Han, and your record is
            kept on your device.
          </p>
        </details>
      </div>
    </section>
  );
}
