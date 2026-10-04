import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import {introductionFrom} from "@src/react/pages/game/hooks/use-introduction/utils/IntroductionFrom";
import {useAppSelector} from "@src/redux/Hooks";
import {useMemo} from "react";
import {useOwnPreferences} from "@src/react/pages/game/hooks/use-own-preferences/UseOwnPreferences";

/** What this player says of themselves to a friend's room, as things stand now (`introductionFrom`). */
export function useIntroduction(): Introduction {
  const displayName = useAppSelector(state => state.account.displayName);
  const sharesLook = useAppSelector(state => state.preferences.showOpponentLook);
  const {armyBoardStyles, armyPieceSets} = useOwnPreferences();

  return useMemo(
    () => introductionFrom({displayName, worn: {armyBoardStyles, armyPieceSets}, sharesLook}),
    [displayName, armyBoardStyles, armyPieceSets, sharesLook],
  );
}
