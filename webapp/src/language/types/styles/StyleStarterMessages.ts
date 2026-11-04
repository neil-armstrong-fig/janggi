/** Where making a style begins. The price comes already written in the language's own numbers. */
export interface StyleStarterMessages {
  readonly label: string;
  readonly heading: string;
  readonly locked: (price: string) => string;
  readonly note: string;
  readonly kindLabel: string;
  readonly fromLabel: string;
  readonly start: string;
}
