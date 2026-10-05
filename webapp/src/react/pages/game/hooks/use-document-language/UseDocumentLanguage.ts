import {useAppSelector} from "@src/redux/Hooks";
import {useEffect} from "react";

/**
 * Keeps `<html lang>` as the language the game is read in, which is what a screen reader chooses its voice
 * by and what lets a browser hyphenate and choose Korean's own glyph forms for the text it is shown.
 */
export function useDocumentLanguage(): void {
  const language = useAppSelector(state => state.preferences.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
}
