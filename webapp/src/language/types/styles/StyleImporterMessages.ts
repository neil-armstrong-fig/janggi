/** The box a shared key is pasted into, and what comes of it. */
export interface StyleImporterMessages {
  readonly label: string;
  readonly heading: string;
  readonly note: string;
  readonly submit: string;
  readonly placeholder: string;
  readonly addedBoard: (name: string) => string;
  readonly addedPieces: (name: string) => string;
}
