import {addressWithoutTutorial} from "@src/react/pages/game/hooks/use-tutorial-link/utils/AddressWithoutTutorial";
import {startTheTutorial} from "@src/redux/tutorial/actions/StartTheTutorial";
import {tutorialEntryOf} from "@src/react/pages/game/tutorial/entry/TutorialEntryOf";
import {tutorialAskedFor} from "@src/react/pages/game/hooks/use-tutorial-link/utils/TutorialAskedFor";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect} from "react";

/**
 * Opens the game on the tutorial where the address asks for it — the guide's link: resumed from the furthest scene reached, for a player who came part way, as the You tab's button does. The link is taken off the address once it has been answered, so a reload opens the player's own game.
 *
 * A first visit that has not yet been through the welcome gets the welcome instead, as any first visit does: it ends on
 * the choice of the tutorial, so the link is answered there rather than by skipping the welcome for good.
 */
export function useTutorialLink(): void {
  const dispatch = useAppDispatch();
  const welcomeWaiting = useAppSelector(state => state.onboarding.stage === "welcome");
  const progress = useAppSelector(state => state.tutorial.progress);

  useEffect(() => {
    if (!tutorialAskedFor(globalThis.location.search)) return;

    if (!welcomeWaiting) dispatch(startTheTutorial(tutorialEntryOf(progress)));
    globalThis.history.replaceState(globalThis.history.state, "", addressWithoutTutorial(globalThis.location.href));
  }, [dispatch, welcomeWaiting, progress]);
}
