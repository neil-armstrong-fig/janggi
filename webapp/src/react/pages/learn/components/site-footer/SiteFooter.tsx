export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-wood/15 py-8 text-sm text-wood/60 sm:flex-row sm:items-center sm:pb-12">
      <p>Janggi · 장기</p>

      <nav className="flex flex-wrap items-center gap-5" aria-label="Footer navigation">
        <a className="underline decoration-wood/35 underline-offset-4" href="./">
          Play
        </a>

        <a className="underline decoration-wood/35 underline-offset-4" href="references.html">
          Sources &amp; credits
        </a>

        <a
          className="underline decoration-wood/35 underline-offset-4"
          href="https://github.com/neil-armstrong-fig/janggi"
        >
          Source code
        </a>
      </nav>
    </footer>
  );
}
