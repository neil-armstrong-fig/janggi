import {ENGLISH_SIDES} from "@src/language/sides/english/EnglishSides";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** What an army is called in English, for a sentence that names one. */
export function englishSideName(side: Side): string {
  return ENGLISH_SIDES[side];
}
