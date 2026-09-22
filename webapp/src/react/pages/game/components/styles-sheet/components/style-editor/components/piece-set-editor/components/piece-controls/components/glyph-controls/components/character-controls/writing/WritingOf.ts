import type {CharacterSet} from "@src/styles/types/CharacterSet";
import type {WritingName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";
import {WRITINGS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/Writings";
import {WRITING_NAMES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";

/**
 * Which shipped writing a set of characters is, or undefined where it is one of its own — compared by what
 * is written rather than by identity, since a style read back from text has characters of its own to compare.
 */
export function writingOf(characterSet: CharacterSet): WritingName | undefined {
  const written = JSON.stringify(characterSet);

  return WRITING_NAMES.find(name => JSON.stringify(WRITINGS[name]) === written);
}
