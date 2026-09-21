/**
 * What sets janggi's two games apart, in as few plain words as will do it on a phone.
 *
 * Only what a player meets is here — how the armies are laid out, when a bikjang may be called and
 * what calling one does — and the rules that are the same in both are gathered in one line at the foot.
 * The reasoning and the sources are `docs/rules.md` §6.2 and §6.6; the rules themselves are
 * `canPlace`, `canCallBikjang` and `outcomeOf`. Stacked rather than side by side, because two columns
 * across a phone leave each too narrow to read.
 */
export function MatchFormatExplanation(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h3 className="font-semibold text-wood">Casual</h3>

        <p className="text-xs text-white/60">The friendly game most janggi sites play.</p>

        <ul className="flex list-disc flex-col gap-1 pl-4">
          <li>Both armies start set up. Either can be changed until the first move.</li>

          <li>
            When the generals face each other down an open file, either player may call <strong>bikjang</strong>, and
            the game is a <strong>draw</strong>.
          </li>

          <li>
            Players may agree to a draw, and once <strong>both sides are under 30 points</strong> a position that comes
            round a third time is a draw too.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-1">
        <h3 className="font-semibold text-wood">Scored</h3>

        <p className="text-xs text-white/60">The Korea Janggi Association’s tournament game. There are no draws.</p>

        <ul className="flex list-disc flex-col gap-1 pl-4">
          <li>Han picks its setup first and can’t change it. Cho picks after seeing Han’s.</li>

          <li>
            Bikjang can only be called once <strong>both sides are under 30 points</strong>, and whoever is ahead on
            points <strong>wins</strong>. So does a position that comes round a third time under 30 points.
          </li>
        </ul>
      </section>

      <p className="text-xs text-white/60">
        In both, two passes in a row end the game on points, and Han starts 1.5 points up for moving second. Your rating
        is kept separately for each.
      </p>
    </div>
  );
}
