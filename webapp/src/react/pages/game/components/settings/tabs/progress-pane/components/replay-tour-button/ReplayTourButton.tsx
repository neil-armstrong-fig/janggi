import {tourStarted} from "@src/redux/onboarding/OnboardingSlice";
import {useAppDispatch} from "@src/redux/Hooks";

/**
 * Starts the tour again, for a player who skipped it or has forgotten it. It puts the sheet away by itself:
 * the tour's first step is about the board, and the sheet is what it would be standing on.
 */
export function ReplayTourButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      data-testid="tour-replay"
      onClick={() => dispatch(tourStarted())}
      className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>Replay the tour</span>

      <span className="text-xs text-wood/70">Show me around again</span>
    </button>
  );
}
