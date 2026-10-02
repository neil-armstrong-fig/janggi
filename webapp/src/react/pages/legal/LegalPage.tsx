interface Props {
  readonly kind: "privacy" | "terms";
  readonly title: string;
  readonly summary: string;
  readonly children: React.ReactNode;
}

/** The shared reading frame for Janggi's two public legal documents. */
export function LegalPage({kind, title, summary, children}: Props): React.JSX.Element {
  return (
    <div className="min-h-dvh bg-ground text-wood">
      <main data-testid="legal" data-kind={kind} className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="border-b border-wood/20 pb-8">
          <a className="inline-flex items-center gap-3 no-underline" href="./" aria-label="Janggi game">
            <img src="icon.svg" width="48" height="48" alt="Janggi game logo" />

            <span>
              <b className="block tracking-wide">Janggi</b>

              <small className="text-xs text-wood/65">장기 · Play free</small>
            </span>
          </a>

          <p className="mt-10 text-xs font-bold tracking-[0.19em] text-gold uppercase">Legal</p>

          <h1 className="mt-3 font-serif text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{title}</h1>

          <p className="mt-5 text-lg leading-relaxed text-wood/80">{summary}</p>

          <p className="mt-4 text-sm text-wood/60">Effective 2 October 2026</p>
        </header>

        <article className="space-y-10 py-10 [&_a]:underline [&_a]:decoration-wood/35 [&_a]:underline-offset-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:leading-relaxed [&_p]:leading-relaxed">
          {children}
        </article>

        <footer className="flex flex-col gap-4 border-t border-wood/20 py-8 text-sm text-wood/65 sm:flex-row sm:items-center sm:justify-between">
          <p>Janggi · 장기</p>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal navigation">
            <a className="underline decoration-wood/35 underline-offset-4" href="./">
              Play
            </a>

            <a className="underline decoration-wood/35 underline-offset-4" href="privacy.html">
              Privacy
            </a>

            <a className="underline decoration-wood/35 underline-offset-4" href="terms.html">
              Terms
            </a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
