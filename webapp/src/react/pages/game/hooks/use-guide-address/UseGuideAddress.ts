import {addressOfGuide} from "@src/language/address/AddressOfGuide";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * Where the guide is in the language the game is read in, so every link to it from the game, in Settings and in the
 * tour, leads a Korean player to the Korean guide. It selects only the language, as `useMessages` does.
 */
export function useGuideAddress(): string {
  const language = useAppSelector(state => state.preferences.language);

  return addressOfGuide(language, import.meta.env.BASE_URL);
}
