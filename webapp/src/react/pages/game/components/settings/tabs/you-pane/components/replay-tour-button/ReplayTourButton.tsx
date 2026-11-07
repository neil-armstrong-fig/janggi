import {Button} from "@src/react/pages/game/components/button/Button";
import {tourStarted} from "@src/redux/slices/onboarding/OnboardingSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Starts the tour again, for a player who skipped it or has forgotten it. It puts the sheet away by itself:
 * the tour's first step is about the board, and the sheet is what it would be standing on.
 */
export function ReplayTourButton(): React.JSX.Element {
  const unavailable = useAppSelector(state => {
    return (
      state.friend.code !== undefined || state.friend.parkedGame !== undefined || state.tutorial.parked !== undefined
    );
  });
  const dispatch = useAppDispatch();
  const {you} = useMessages();

  return (
    <Button
      variant="outline"
      disabled={unavailable}
      data-testid="tour-replay"
      onClick={() => dispatch(tourStarted())}
      className="items-center justify-between gap-4"
    >
      <span>{you.links.replayTour.title}</span>

      <span className="text-xs text-wood/70">{you.links.replayTour.note}</span>
    </Button>
  );
}
