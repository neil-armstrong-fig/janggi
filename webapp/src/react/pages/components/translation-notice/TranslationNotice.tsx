import type {MachineTranslationNoticeMessages} from "@src/language/types/MachineTranslationNoticeMessages";

interface Props {
  readonly messages: MachineTranslationNoticeMessages;
  /** Where the page it was translated from is. */
  readonly originalAddress: string;
}

/**
 * What a machine translation says of itself, at the very top, in its own language and in English, where nobody reads
 * past it without seeing it. It is not dismissible: it is a fact about the page, not a message to the reader.
 */
export function TranslationNotice({messages, originalAddress}: Props): React.JSX.Element {
  return (
    <section
      className="mt-3 flex flex-col gap-2 rounded-lg border border-gold/60 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-wood"
      aria-label={messages.label}
      data-testid="translation-notice"
    >
      <p className="font-bold">{messages.statement}</p>

      <p className="text-wood/75">{messages.statementInEnglish}</p>

      <a
        className="w-fit underline decoration-gold underline-offset-4 hover:decoration-wood"
        data-testid="translation-notice-original"
        href={originalAddress}
        hrefLang="en"
        lang="en"
      >
        {messages.linkToOriginal}
      </a>
    </section>
  );
}
