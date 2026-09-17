export function SiteHeader(): React.JSX.Element {
  return (
    <header className="flex min-h-21 items-center justify-between gap-4 border-b border-wood/15">
      <a className="inline-flex items-center gap-3 no-underline" href="./" aria-label="Janggi game">
        <img src="icon.svg" width="52" height="52" alt="Janggi game logo" />

        <span className="block">
          <b className="block text-base tracking-wide">Janggi</b>

          <small className="hidden text-xs text-wood/65 sm:block">장기 · Play free</small>
        </span>
      </a>

      <nav className="flex items-center gap-5 text-sm" aria-label="Guide navigation">
        <a className="hidden underline decoration-wood/35 underline-offset-4 md:block" href="#pieces">
          Pieces
        </a>

        <a className="hidden underline decoration-wood/35 underline-offset-4 md:block" href="#questions">
          Questions
        </a>

        <a
          className="rounded-full border border-gold/50 px-4 py-2 no-underline hover:bg-wood/10 focus:outline-2 focus:outline-offset-4 focus:outline-gold"
          href="./"
        >
          Play free
        </a>
      </nav>
    </header>
  );
}
