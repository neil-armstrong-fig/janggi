import {Button} from "@src/react/pages/game/components/button/Button";
import {tourStarted} from "@src/redux/onboarding/OnboardingSlice";
import {useAppDispatch} from "@src/redux/Hooks";

/**
 * Starts the tour again, for a player who skipped it or has forgotten it. It puts the sheet away by itself:
 * the tour's first step is about the board, and the sheet is what it would be standing on.
 */
export function ReplayTourButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      data-testid="tour-replay"
      onClick={() => dispatch(tourStarted())}
      className="items-center justify-between gap-4"
    >
      <span>Replay the tour</span>

      <span className="text-xs text-wood/70">Show me around again</span>
    </Button>
  );
}
