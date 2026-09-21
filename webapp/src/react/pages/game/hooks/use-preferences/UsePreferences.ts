import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {useAppSelector} from "@src/redux/Hooks";
import {useMemo} from "react";

/**
 * A player's preferences, ready to draw with. The store holds each by name — see
 * `PreferencesSliceState` — and this is the one place a name becomes the style it names, so the three
 * sections that wear them and the page that plays the sound all look them up the same way. The player's
 * XP and their own styles are read beside the names, because those decide what a name may be worn as.
 *
 * Kept while none of those three changes: every `Cell` on the board calls this, and a pointer crossing
 * the board re-renders them all.
 */
export function usePreferences(): Preferences {
  const names = useAppSelector(state => state.preferences);
  const xp = useAppSelector(state => state.progress.xp);
  const customStyles = useAppSelector(state => state.customStyles);

  return useMemo(() => preferencesFrom(names, xp, customStyles), [names, xp, customStyles]);
}
