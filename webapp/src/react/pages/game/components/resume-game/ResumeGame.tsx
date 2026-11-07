import {ResumeClock} from "@src/react/pages/game/components/resume-game/components/resume-clock/ResumeClock";
import {boardFlippedForHan} from "@src/react/pages/game/utils/BoardFlippedForHan";
import {clockResumed} from "@src/redux/slices/clock/ClockSlice";
import {clsx} from "clsx";
import {sideWaitingToResume} from "@src/redux/slices/clock/selecting/SideWaitingToResume";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * What a clocked game comes back to after a reload: time away does not count, so nothing runs until the player to move
 * says so. It names them, though it cannot tell who tapped, and it turns to face them as the plaques do. The board stays
 * in sight behind it. Resume is the only way forward, there being nothing to skip to, and it starts the clock again with
 * the time already spent on the turn still spent (`clockAfterResume`).
 *
 * It is up while the clock holds a turn (`sideWaitingToResume`), which only `loadClock` leaves it doing.
 */
export function ResumeGame(): React.JSX.Element | undefined {
  const side = useAppSelector(sideWaitingToResume);
  const opponent = useAppSelector(state => state.game.opponent);
  const {flipBoardForHan} = usePreferences();
  const messages = useMessages();
  const dispatch = useAppDispatch();
  if (!side) return undefined;

  const flipped = boardFlippedForHan(flipBoardForHan, opponent, side);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-30 flex justify-center bg-black/60 p-3 sm:items-center",
        flipped && "items-start",
        !flipped && "items-end",
      )}
    >
      <section
        data-testid="resume-game"
        data-side={side}
        data-flipped={flipped}
        role="dialog"
        aria-modal
        aria-labelledby="resume-game-title"
        className={clsx(
          "flex w-full max-w-md flex-col gap-4 rounded-2xl bg-ground-raised p-5 shadow-2xl shadow-black",
          flipped && "rotate-180",
        )}
      >
        <h2 id="resume-game-title" className="text-lg font-semibold text-wood">
          {messages.announcements.toMove(side)}
        </h2>

        <p className="text-sm text-white/80">{messages.resume.pausedLine}</p>

        <div className="grid grid-cols-2 gap-2">
          <ResumeClock side="cho" name={messages.sides.cho} toMove={side === "cho"} />

          <ResumeClock side="han" name={messages.sides.han} toMove={side === "han"} />
        </div>

        <button
          type="button"
          data-testid="resume-game-resume"
          onClick={() => dispatch(clockResumed(Date.now()))}
          className="cursor-pointer rounded-lg bg-gold px-4 py-3 text-base font-semibold text-ink"
        >
          {messages.resume.resume}
        </button>
      </section>
    </div>
  );
}
