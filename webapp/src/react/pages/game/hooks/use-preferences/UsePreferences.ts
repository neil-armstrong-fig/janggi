import type {Preferences} from "@src/react/pages/game/hooks/use-preferences/types/Preferences";
import {preferencesFrom} from "@src/react/pages/game/hooks/use-preferences/utils/PreferencesFrom";
import {useAppSelector} from "@src/redux/Hooks";
import {opponentLookInUse} from "@src/redux/online/selecting/OpponentLookInUse";
import {useMemo} from "react";
import {withOpponentLook} from "@src/react/pages/game/hooks/use-preferences/utils/WithOpponentLook";

/**
 * A player's preferences, ready to draw with. The store holds each by name — see
 * `PreferencesSliceState` — and this is the one place a name becomes the style it names, so the three
 * sections that wear them and the page that plays the sound all look them up the same way. The player's
 * XP and their own styles are read beside the names, because those decide what a name may be worn as.
 *
 * **In a game against a friend** it is each half in its owner's board, and each army in its owner's set, where the player has not
 * turned that off (`withOpponentLook`). The caller sees only a `Preferences`, so nothing that draws knows there is a friend.
 *
 * Kept while none of those changes: every `Cell` on the board calls this, and a pointer crossing
 * the board re-renders them all.
 */
export function usePreferences(): Preferences {
  const names = useAppSelector(state => state.preferences);
  const xp = useAppSelector(state => state.progress.xp);
  const customStyles = useAppSelector(state => state.customStyles);

  const friend = useAppSelector(state => state.friend);

  return useMemo(() => {
    const own = preferencesFrom(names, xp, customStyles);
    const friends = opponentLookInUse(friend, names.showOpponentLook);
    if (friends === undefined) return own;

    return withOpponentLook(own, friends);
  }, [names, xp, customStyles, friend]);
}
