/** One kind of piece in the guide: what to call it, the mark it carries, how it moves, and the caption of its example. */
export interface GuidePieceMessages {
  readonly name: string;
  readonly mark: string;
  readonly description: string;
  /** What the small board under the piece shows, read aloud by a screen reader as well as written beneath it. */
  readonly caption: string;
}
