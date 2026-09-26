import {Tour} from "@src/react/pages/game/components/onboarding/components/tour/Tour";
import {Welcome} from "@src/react/pages/game/components/onboarding/components/welcome/Welcome";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * What a first-time player is shown around the game with: the welcome, and then the tour over the page
 * itself. Which of them is up is the store's `onboarding.stage`, kept on the device, so a reload comes
 * back to where the player was and a player who skipped it is never shown it again.
 */
export function Onboarding(): React.JSX.Element {
  const stage = useAppSelector(state => state.onboarding.stage);

  return (
    <>
      {stage === "welcome" && <Welcome />}

      {stage === "tour" && <Tour />}
    </>
  );
}
