import {addressOfReferences} from "@src/language/address/AddressOfReferences";
import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import {LanguageSwitch} from "@src/react/pages/components/language-switch/LanguageSwitch";
import {messagesOf} from "@src/language/MessagesOf";
import {referenceSectionsOf} from "@src/react/pages/references/content/ReferenceSectionsOf";
import {ReferenceSection} from "@src/react/pages/references/components/reference-section/ReferenceSection";
import {referencesMessagesOf} from "@src/language/references/ReferencesMessagesOf";
import {ReleaseUpdate} from "@src/react/release-update/ReleaseUpdate";
import {TranslationNotice} from "@src/react/pages/components/translation-notice/TranslationNotice";

interface Props {
  /** The language the references are read in: its page chooses it, as the guide's does. */
  readonly language: LanguageName;
}

export function ReferencesPage({language}: Props): React.JSX.Element {
  const messages = referencesMessagesOf(language);
  const sections = referenceSectionsOf(messages);
  const base = import.meta.env.BASE_URL;
  const addresses = {en: addressOfReferences("en", base), ko: addressOfReferences("ko", base)};

  return (
    <>
      <main data-testid="references" className="mx-auto max-w-5xl px-5 py-10 text-wood sm:px-10 sm:py-16">
        {messages.translationNotice && (
          <div className="mb-8">
            <TranslationNotice messages={messages.translationNotice} originalAddress={addresses.en} />
          </div>
        )}

        <header>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-sm tracking-[0.2em] text-gold">장기 · JANGGI</p>

            <LanguageSwitch
              current={language}
              label={messages.languageLabel}
              names={messages.languageNames}
              addresses={addresses}
            />
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{messages.header.title}</h1>

            <p className="mt-5 text-lg leading-relaxed text-wood/80">{messages.header.introduction}</p>

            <a
              data-testid="references-repository"
              href="https://github.com/neil-armstrong-fig/janggi"
              className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-wood/30 px-4 py-2 font-medium hover:bg-wood/10"
            >
              {messages.header.repository}
            </a>

            <p className="mt-3 text-sm leading-relaxed text-wood/70">
              {messages.header.byline}
              <a
                className="underline underline-offset-4"
                href="https://github.com/neil-armstrong-fig/janggi/blob/main/LICENSE"
              >
                {messages.header.projectLicence}
              </a>
            </p>
          </div>
        </header>

        <div className="mt-10 grid items-start gap-10 border-t border-wood/20 pt-8 md:mt-14 md:grid-cols-[11rem_1fr] md:gap-12">
          <nav aria-label={messages.navigationLabel} className="md:sticky md:top-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gold uppercase">{messages.navigationLabel}</p>

            <ul className="flex flex-col gap-1 text-sm">
              {sections.map(section => (
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
            {sections.map(section => (
              <ReferenceSection key={section.id} section={section} licenceOf={messages.licenceOf} />
            ))}
          </div>
        </div>

        <footer className="mt-14 border-t border-wood/20 pt-6 text-sm leading-relaxed text-wood/70">
          {messages.thanks}
        </footer>
      </main>

      <ReleaseUpdate words={messagesOf(language).release} />
    </>
  );
}
