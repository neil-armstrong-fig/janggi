/**
 * Anything a picker can offer: a board style, a piece set, an opening setup.
 *
 * A name is all the picker needs — it is the label on the button, and it is what says which option
 * is the one in use — so this is the whole constraint rather than a shared base the three real
 * types would otherwise have to inherit from.
 */
export interface WithName {
  readonly name: string;
}
