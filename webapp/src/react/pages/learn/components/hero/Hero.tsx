import {useInstallation} from "@src/react/pages/hooks/use-installation/UseInstallation";

export function Hero(): React.JSX.Element {
  const installation = useInstallation();

  return (
    <section
      className="grid items-center gap-8 py-16 md:min-h-[min(46rem,calc(100dvh-5.25rem))] md:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.7fr)] md:gap-16 lg:py-28"
      aria-labelledby="guide-title"
    >
      <div>
        <p className="mb-3 text-xs font-bold tracking-[0.19em] text-gold uppercase">The complete beginner’s guide</p>

        <h1
          id="guide-title"
          className="mb-6 max-w-[15ch] font-serif text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-8xl"
        >
          How to play Janggi (Korean chess)
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-wood/80 sm:text-xl">
          Learn the board, all seven pieces and the rules that make it distinctive. Then play against a friend or the
          computer.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gold px-5 py-3 font-bold text-ink no-underline hover:bg-gold/85 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
            data-testid="guide-play"
            href="./"
          >
            Play Janggi for free
          </a>

          {installation.canInstall && (
            <button
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-wood/30 bg-transparent px-5 py-3 font-bold text-wood hover:bg-wood/10 focus:outline-2 focus:outline-offset-4 focus:outline-gold min-[38.0625rem]:hidden"
              data-testid="guide-install"
              type="button"
              onClick={installation.offerInstallation}
            >
              Save to this device
            </button>
          )}

          <a
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-wood/30 px-5 py-3 font-bold no-underline hover:bg-wood/10 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
            href="#what-is-janggi"
          >
            Start with the rules
          </a>
        </div>

        <p className="mt-3 text-xs text-wood/55">No account needed</p>
      </div>

      <aside
        className="max-w-lg rounded-2xl border border-wood/15 bg-ground-raised/80 px-6 shadow-2xl"
        aria-label="Janggi quick facts"
      >
        <p className="flex items-baseline justify-between gap-4 border-b border-wood/10 py-5">
          <span className="text-xs tracking-wider text-wood/60 uppercase">Board</span>

          <strong className="text-right">9 × 10 intersections</strong>
        </p>

        <p className="flex items-baseline justify-between gap-4 border-b border-wood/10 py-5">
          <span className="text-xs tracking-wider text-wood/60 uppercase">Players</span>

          <strong className="text-right">2 · Cho and Han</strong>
        </p>

        <p className="flex items-baseline justify-between gap-4 border-b border-wood/10 py-5">
          <span className="text-xs tracking-wider text-wood/60 uppercase">Pieces</span>

          <strong className="text-right">16 per army</strong>
        </p>

        <p className="flex items-baseline justify-between gap-4 py-5">
          <span className="text-xs tracking-wider text-wood/60 uppercase">Goal</span>

          <strong className="text-right">Checkmate the general</strong>
        </p>
      </aside>
    </section>
  );
}
