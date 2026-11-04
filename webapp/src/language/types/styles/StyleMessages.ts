import type {StyleSheetMessages} from "@src/language/types/styles/StyleSheetMessages";
import type {OwnStylesMessages} from "@src/language/types/styles/OwnStylesMessages";
import type {StyleImporterMessages} from "@src/language/types/styles/StyleImporterMessages";
import type {StyleStarterMessages} from "@src/language/types/styles/StyleStarterMessages";
import type {StyleEditorMessages} from "@src/language/types/styles/StyleEditorMessages";
import type {StyleToolsMessages} from "@src/language/types/styles/StyleToolsMessages";
import type {StyleFieldMessages} from "@src/language/types/styles/StyleFieldMessages";
import type {BoardControlMessages} from "@src/language/types/styles/BoardControlMessages";
import type {PieceControlMessages} from "@src/language/types/styles/PieceControlMessages";
import type {StyleRefusalMessages} from "@src/language/types/styles/StyleRefusalMessages";
import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

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
