import type {Messages} from "@src/language/types/Messages";
import {messagesOf} from "@src/language/MessagesOf";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * Every word of the game in the language the player reads it in — what a component draws instead of
 * writing the English itself. It selects only the language, not the whole of the preferences, so a
 * preference changing elsewhere does not redraw everything that speaks.
 */
export function useMessages(): Messages {
  const language = useAppSelector(state => state.preferences.language);

  return messagesOf(language);
}
