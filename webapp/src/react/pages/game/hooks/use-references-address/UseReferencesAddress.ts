import {addressOfReferences} from "@src/language/address/AddressOfReferences";
import {useAppSelector} from "@src/redux/Hooks";

/** Where the references are in the language the game is read in. It selects only the language, as `useMessages` does. */
export function useReferencesAddress(): string {
  const language = useAppSelector(state => state.preferences.language);

  return addressOfReferences(language, import.meta.env.BASE_URL);
}
