import {REFERENCE_SECTIONS} from "@src/react/pages/references/content/ReferenceSections";
import {ReferenceSection} from "@src/react/pages/references/components/reference-section/ReferenceSection";
import {ReleaseUpdate} from "@src/react/release-update/ReleaseUpdate";

export function ReferencesPage(): React.JSX.Element {
  return (
    <>
      <main data-testid="references" className="mx-auto max-w-5xl px-5 py-10 text-wood sm:px-10 sm:py-16">
        <header className="max-w-2xl">
          <p className="mb-4 text-sm tracking-[0.2em] text-gold">장기 · JANGGI</p>

          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">References &amp; credits</h1>

          <p className="mt-5 text-lg leading-relaxed text-wood/80">
            A game with a long history, made possible here by a generous community. Thank you to the players, writers
            and open source contributors whose work helped us build it.
          </p>

          <a
            data-testid="references-repository"
            href="https://github.com/neil-armstrong-fig/janggi"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-wood/30 px-4 py-2 font-medium hover:bg-wood/10"
          >
            View the source on GitHub
          </a>

          <p className="mt-3 text-sm leading-relaxed text-wood/70">
            Janggi by Neil Armstrong ·{" "}
            <a
              className="underline underline-offset-4"
              href="https://github.com/neil-armstrong-fig/janggi/blob/main/LICENSE"
            >
              MIT licence
            </a>
          </p>
        </header>

        <div className="mt-10 grid items-start gap-10 border-t border-wood/20 pt-8 md:mt-14 md:grid-cols-[11rem_1fr] md:gap-12">
          <nav aria-label="On this page" className="md:sticky md:top-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gold uppercase">On this page</p>

            <ul className="flex flex-col gap-1 text-sm">
              {REFERENCE_SECTIONS.map(section => (
                <li key={section.id}>
                  <a
                    data-testid={`references-${section.id}-jump`}
                    href={`#${section.id}`}
                    className="block py-2 leading-relaxed underline decoration-wood/30 underline-offset-4 hover:decoration-gold"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-14">
            {REFERENCE_SECTIONS.map(section => (
              <ReferenceSection key={section.id} section={section} />
            ))}
          </div>
        </div>

        <footer className="mt-14 border-t border-wood/20 pt-6 text-sm leading-relaxed text-wood/70">
          Thank you to everyone who shares their knowledge of janggi and makes their work available for others to build
          on.
        </footer>
      </main>

      <ReleaseUpdate />
    </>
  );
}
