/**
 * What a translated reading page says of itself before anything else: that a machine made it, in its own language and in
 * English, with the link back to the page it was made from. The original has none.
 */
export interface MachineTranslationNoticeMessages {
  /** What a reader of the translation is told, in the translation's own language. */
  readonly statement: string;
  /** The same, in English, for the reader who came for the original or checks it against it. */
  readonly statementInEnglish: string;
  readonly linkToOriginal: string;
  /** A name for the notice, for a screen reader. */
  readonly label: string;
}
