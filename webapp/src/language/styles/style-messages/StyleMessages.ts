import type {StyleEditorMessages} from "@src/language/styles/style-messages/types/StyleEditorMessages";
import type {BoardControlMessages} from "@src/language/styles/board-control-messages/BoardControlMessages";
import type {PieceControlMessages} from "@src/language/styles/piece-control-messages/PieceControlMessages";
import type {StyleRefusalMessages} from "@src/language/styles/style-messages/types/StyleRefusalMessages";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";
import type {CopyScope} from "@janggi/shared/janggi/styles/CopyScope";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** Everything the styles sheet and the style editor say. A style's own name is a proper name and is not here. */
export interface StyleMessages {
  readonly kinds: Record<StyleKind, string>;
  readonly sheet: StyleSheetMessages;
  readonly ownStyles: OwnStylesMessages;
  readonly importer: StyleImporterMessages;
  readonly starter: StyleStarterMessages;
  readonly editor: StyleEditorMessages;
  readonly tools: StyleToolsMessages;
  readonly fields: StyleFieldMessages;
  readonly board: BoardControlMessages;
  readonly pieces: PieceControlMessages;
  readonly refusals: StyleRefusalMessages;
}

/** The list of a player's own styles. */
interface OwnStylesMessages {
  readonly label: string;
  readonly heading: string;
  readonly none: string;
  readonly copyKey: string;
  readonly delete: string;
}

/** What the editor's fields say of themselves. Each screen-reader label is whole, built from the field's own. */
interface StyleFieldMessages {
  readonly plainColour: string;
  readonly notAColour: string;
  readonly howSolid: (label: string) => string;
  readonly asNumber: (label: string) => string;
  readonly on: string;
  readonly off: string;
}

/** The box a shared key is pasted into, and what comes of it. */
interface StyleImporterMessages {
  readonly label: string;
  readonly heading: string;
  readonly note: string;
  readonly submit: string;
  readonly placeholder: string;
  readonly addedBoard: (name: string) => string;
  readonly addedPieces: (name: string) => string;
}

/** The styles sheet itself. */
interface StyleSheetMessages {
  readonly title: string;
  readonly closeLabel: string;
}

/** Where making a style begins. The price comes already written in the language's own numbers. */
interface StyleStarterMessages {
  readonly label: string;
  readonly heading: string;
  readonly locked: (price: string) => string;
  readonly note: string;
  readonly kindLabel: string;
  readonly fromLabel: string;
  readonly start: string;
}

/** The ways to start a style over: back to where it began, from another the player has, or from a key. */
interface StyleToolsMessages {
  readonly summary: string;
  readonly resetTo: (name: string) => string;
  readonly loadOneYouHave: string;
  readonly styleToLoad: string;
  readonly howMuch: string;
  readonly scopes: Record<CopyScope, string>;
  readonly load: string;
  readonly loadFromKey: string;
  readonly loadKey: string;
  readonly keyPlaceholder: string;
  readonly loaded: (name: string) => string;
  readonly loadedArmy: (side: Side, name: string) => string;
  readonly boardKeyHere: string;
  readonly piecesKeyHere: string;
}
