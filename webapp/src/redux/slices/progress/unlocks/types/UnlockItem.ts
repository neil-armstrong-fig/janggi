/** A board or a piece set of one name at one price, opened together and named once. */
interface ThemeUnlock {
  readonly kind: "theme";
  readonly name: string;
}

interface BoardUnlock {
  readonly kind: "board";
  readonly name: string;
}

interface PiecesUnlock {
  readonly kind: "pieces";
  readonly name: string;
}

interface StyleEditorUnlock {
  readonly kind: "style-editor";
}

/**
 * One thing XP opens, as data: what a player reads for it is the language's (`unlockWordsOf`), and a style keeps its
 * own name in every language.
 */
export type UnlockItem = ThemeUnlock | BoardUnlock | PiecesUnlock | StyleEditorUnlock;
