import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {Button} from "@src/react/pages/game/components/button/Button";
import {SETUPS} from "@janggi/engine/setups/Setups";
import {chooseFriendSetup} from "@src/redux/online/actions/playing/ChooseFriendSetup";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Both are sat down: each chooses the arrangement of their own army. The room holds the first choice from the other until
 * both are made, so neither answers the other's, and then shows them both at once.
 */
export function ChooseSetup(): React.JSX.Element {
  const {opponent, ownSide, chosenSetup} = useAppSelector(state => state.friend);
  const dispatch = useAppDispatch();
  const {friend, play} = useMessages();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-white/60">{friend.setup.playing(opponent?.displayName ?? "")}</p>

      {chosenSetup === undefined && (
        <>
          <p className="text-sm text-white/70">{ownSide !== undefined && friend.setup.choose(ownSide)}</p>

          <div className="flex flex-col gap-2">
            {SETUPS.map(setup => (
              <Button
                variant="outline"
                key={setup.name}
                data-testid={`friend-setup-${setup.name.toLowerCase().replaceAll(" ", "-")}`}
                onClick={() => dispatch(chooseFriendSetup(setup.name))}
                className="flex-col items-start text-left"
              >
                <span>{play.setupNames[setup.name]}</span>

                <span className="text-xs text-wood/70">{play.setupDescriptions[setup.name]}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {chosenSetup !== undefined && (
        <p role="status" className="text-sm text-white/70">
          {friend.setup.chose(play.setupNames[chosenSetup])}
        </p>
      )}
    </div>
  );
}
