import type {UnlockItem} from "@src/redux/progress/unlocks/types/UnlockItem";
import type {UnlockMessages} from "@src/language/types/UnlockMessages";

/** What a player reads for the things an amount of XP opens, in the language being read. */
export function unlockWordsOf(items: readonly UnlockItem[], words: UnlockMessages): string {
  return items.map(item => wordsFor(item, words)).join(", ");
}

function wordsFor(item: UnlockItem, words: UnlockMessages): string {
  if (item.kind === "style-editor") return words.styleEditor;

  return words[item.kind](item.name);
}
