import {keepLanguageForWorker} from "@src/redux/notifications/KeepLanguageForWorker";
import {useAppSelector} from "@src/redux/Hooks";
import {useEffect} from "react";

/** Keeps the service worker told which language the game is read in, so the notification it shows is in it too. */
export function useWorkerLanguage(): void {
  const language = useAppSelector(state => state.preferences.language);

  useEffect(() => {
    void keepLanguageForWorker(language);
  }, [language]);
}
