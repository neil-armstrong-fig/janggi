import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {neonStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/NeonStyle";
import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";

/**
 * The styles that ship with the app. Add one by writing another `BoardStyle` in this folder and
 * listing it here.
 *
 * User-defined styles are the same schema loaded from somewhere else — a sibling folder to this
 * one — so whatever offers a choice concatenates the two lists rather than treating built-ins as a
 * special case.
 */
export const BUILT_IN_STYLES: readonly BuiltInBoardStyle[] = [classicStyle, neonStyle];
