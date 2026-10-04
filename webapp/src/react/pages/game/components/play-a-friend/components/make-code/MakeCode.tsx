import {Button} from "@src/react/pages/game/components/button/Button";
import {DEFAULT_ROOM_AWAY_DAYS, ROOM_AWAY_DAYS} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import {SIDES} from "@janggi/shared/janggi/pieces/Side";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {createFriendRoom} from "@src/redux/online/actions/entering/CreateFriendRoom";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useIntroduction} from "@src/react/pages/game/hooks/use-introduction/UseIntroduction";
import {useState} from "react";

const AWAY_LABELS: Record<RoomAwayDays, string> = {
  1: "A day",
  3: "3 days",
  7: "A week",
  14: "2 weeks",
  30: "A month",
  90: "3 months",
};

const SIDE_LABELS: Record<Side, string> = {han: "Han (red)", cho: "Cho (blue)"};

/** Choose an army and make a code for a friend to come in by. The friend gets the other army. */
export function MakeCode(): React.JSX.Element {
  const [side, setSide] = useState<Side>("cho");
  const [awayDays, setAwayDays] = useState<RoomAwayDays>(DEFAULT_ROOM_AWAY_DAYS);
  const createFailed = useAppSelector(state => state.friend.createFailed);
  const introduction = useIntroduction();
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-white/60">Make a code</p>

      <p className="text-sm text-white/70">Choose your army. Your friend plays the other.</p>

      <div className="grid grid-cols-2 gap-2">
        {SIDES.map(each => (
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

      <p className="text-sm text-white/70">
        A game can wait. If you are both away, the room is kept this long before it is let go. Nobody loses by being
        away.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {ROOM_AWAY_DAYS.map(days => (
          <button
            key={days}
            type="button"
            data-testid={`friend-away-${days}`}
            aria-pressed={awayDays === days}
            onClick={() => setAwayDays(days)}
            className={clsx(
              "min-h-11 cursor-pointer rounded-lg border px-2 text-sm",
              awayDays === days && "border-wood bg-wood/20 text-wood",
              awayDays !== days && "border-white/20 text-white/70 hover:bg-white/10",
            )}
          >
            {AWAY_LABELS[days]}
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        data-testid="friend-create"
        onClick={() => void dispatch(createFriendRoom({side, awayDays}, introduction))}
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
