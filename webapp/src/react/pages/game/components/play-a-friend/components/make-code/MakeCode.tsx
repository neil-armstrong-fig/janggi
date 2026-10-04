import {Button} from "@src/react/pages/game/components/button/Button";
import {DEFAULT_ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {createFriendRoom} from "@src/redux/online/actions/entering/CreateFriendRoom";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useIntroduction} from "@src/react/pages/game/hooks/use-introduction/UseIntroduction";
import {useState} from "react";

/** Cho moves first, so it is listed first, as the Play tab does. */
const SIDES_IN_PLAY_ORDER: readonly Side[] = ["cho", "han"];

const SIDE_LABELS: Record<Side, string> = {cho: "Cho (first)", han: "Han (second)"};

/** Choose an army and make a code for a friend to come in by. The friend gets the other army. */
export function MakeCode(): React.JSX.Element {
  const [side, setSide] = useState<Side>("cho");
  const createFailed = useAppSelector(state => state.friend.createFailed);
  const introduction = useIntroduction();
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-white/60">Make a code</p>

      <p className="text-sm text-white/70">Choose your army. Your friend plays the other.</p>

      <div className="grid grid-cols-2 gap-2">
        {SIDES_IN_PLAY_ORDER.map(each => (
          <button
            key={each}
            type="button"
            data-testid={`friend-side-${each}`}
            aria-pressed={side === each}
            onClick={() => setSide(each)}
            className={clsx(
              "min-h-11 cursor-pointer rounded-lg border px-3 text-sm",
              side === each && "border-wood bg-wood/20 text-wood",
              side !== each && "border-white/20 text-white/70 hover:bg-white/10",
            )}
          >
            {SIDE_LABELS[each]}
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        data-testid="friend-create"
        onClick={() => void dispatch(createFriendRoom({side, awayDays: DEFAULT_ROOM_AWAY_DAYS}, introduction))}
      >
        Make a code
      </Button>

      {createFailed && (
        <p role="status" className="text-xs text-danger">
          A code could not be made just now. Try again in a little while.
        </p>
      )}
    </div>
  );
}
