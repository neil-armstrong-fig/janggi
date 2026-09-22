/** A face a piece's writing may be set in, named for how it looks. */
export interface FontStack {
  readonly name: string;
  /** A full CSS font stack, ending in a generic family, since nothing is bundled. */
  readonly css: string;
}
