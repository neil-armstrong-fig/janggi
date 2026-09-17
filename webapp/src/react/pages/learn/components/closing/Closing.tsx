export function Closing(): React.JSX.Element {
  return (
    <section className="my-12 rounded-2xl border border-cho/30 bg-gradient-to-br from-cho/15 to-ground-raised/75 px-6 py-10 text-center sm:my-20 sm:p-16">
      <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">Ready to use the rules?</p>

      <h2 className="mb-3 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        Start a Janggi game
      </h2>

      <p className="mb-7 text-wood/75">
        Play across the table with a friend or choose a computer opponent in Settings.
      </p>

      <a
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gold px-5 py-3 font-bold text-ink no-underline hover:bg-gold/85 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
        href="./"
      >
        Play Janggi for free
      </a>
    </section>
  );
}
