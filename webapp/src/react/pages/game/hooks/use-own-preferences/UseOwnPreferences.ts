import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {useAppSelector} from "@src/redux/Hooks";
import {useMemo} from "react";

/**
 * The player's own preferences, ready to use — what they chose, never what a friend's look is dressing the board in.
 * The pickers in the settings read this, so a choice made half way through a game with a friend is the one shown
 * as selected, and what a player tells a friend's room of themselves is theirs and not the friend's.
 * `usePreferences` is what the board is drawn with.
 */
export function useOwnPreferences(): Preferences {
  const names = useAppSelector(state => state.preferences);
  const xp = useAppSelector(state => state.progress.xp);
  const customStyles = useAppSelector(state => state.customStyles);

  return useMemo(() => preferencesFrom(names, xp, customStyles), [names, xp, customStyles]);
}
