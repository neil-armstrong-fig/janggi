import type {CharacterSet} from "@src/styles/types/CharacterSet";
import {HANGUL_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HangulCharacters";
import {HANJA_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/marks/HanjaCharacters";
import type {WritingName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";

/** What each writing puts on each piece — the same characters the built-in sets are written in. */
export const WRITINGS: Readonly<Record<WritingName, CharacterSet>> = {
  Hanja: HANJA_CHARACTERS,
  Hangul: HANGUL_CHARACTERS,
};
