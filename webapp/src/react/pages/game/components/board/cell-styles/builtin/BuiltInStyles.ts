import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import {celadonStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/CeladonStyle";
import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {dancheongStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/DancheongStyle";
import {diagramStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/DiagramStyle";
import {hackerStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/HackerStyle";
import {neonStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/NeonStyle";
import {tournamentStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/TournamentStyle";

/**
 * The styles that ship with the app, in the order XP unlocks them. Add one by writing another
 * `BoardStyle` in this folder, listing it here, adding its name to `BoardStyleName` in `@janggi/shared`,
 * and giving it a price in `UNLOCK_PRICES`.
 *
 * A player's own styles are the same schema from somewhere else — the store — so whatever offers a
 * choice concatenates the two lists rather than treating built-ins as a special case. Every built-in is
 * held to the same check an imported style is, which `BuiltInStyles.test.ts` makes sure of.
 */
export const BUILT_IN_STYLES: readonly BuiltInBoardStyle[] = [
  classicStyle,
  neonStyle,
  diagramStyle,
  tournamentStyle,
  celadonStyle,
  dancheongStyle,
  hackerStyle,
];
