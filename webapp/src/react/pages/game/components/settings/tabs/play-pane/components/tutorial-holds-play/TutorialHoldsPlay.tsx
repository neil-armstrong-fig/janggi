import {Button} from "@src/react/pages/game/components/button/Button";
import {leaveTheTutorial} from "@src/redux/tutorial/actions/LeaveTheTutorial";
import {sheetClosed} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * What the Play tab holds while the tutorial has the board, in place of its settings: each of
 * them deals a game, and one dealt now would land on the tutorial's. Leaving puts the player's own game back, and the
 * settings with it.
 */
export function TutorialHoldsPlay(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {tutorial} = useMessages();

  return (
    <div data-testid="tutorial-holds-play" className="flex flex-col gap-3 py-2">
      <p className="text-sm text-white/80">{tutorial.holdsPlay}</p>

      <Button
        variant="outline"
        onClick={() => {
          dispatch(sheetClosed());
          dispatch(leaveTheTutorial());
        }}
      >
        {tutorial.card.leave}
      </Button>
    </div>
  );
}
