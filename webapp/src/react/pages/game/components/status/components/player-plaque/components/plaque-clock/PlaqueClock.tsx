import type {ClockReadingState} from "@src/redux/clock/poses/types/ClockReadingState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockInUse} from "@src/redux/clock/selecting/ClockInUse";
import {clockReadingOf} from "@src/redux/clock/poses/ClockReadingOf";
import {clsx} from "clsx";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * One army's clock on its plaque, beside its score, in a game that has one: minutes and seconds, and once the free
 * time has gone, the periods left. The army to move is lit, as its plaque is.
 *
 * An example for now: it shows the clock's pose and nothing runs. Its words are drawn from figures, so nothing here
 * waits on `src/language/`. Only a build with `IN_DEVELOPMENT` draws it.
 */
interface Props {
  readonly side: Side;
}

export function PlaqueClock({side}: Props): React.JSX.Element | undefined {
  const timeControl = useAppSelector(clockInUse);
  const pose = useAppSelector(state => state.clock.pose);
  const toMove = useAppSelector(state => state.game.played.present.sideToMove === side);

  if (!timeControl) return undefined;

  const {state, seconds, periods} = clockReadingOf(timeControl, pose, toMove);

  return (
    <span
      data-testid={`unreleased-clock-${side}`}
      data-state={state}
      data-seconds={seconds}
      data-periods={periods}
      className={clsx(
        "shrink-0 rounded-md bg-black/30 px-1.5 py-0.5 text-sm font-semibold whitespace-nowrap tabular-nums",
        toMove && TONES[state],
        !toMove && "text-white/50",
        toMove && state === "low" && "motion-safe:animate-pulse",
      )}
    >
      {faceOf(seconds)}

      {state !== "free" && periods > 0 && <span className="ml-1 text-xs font-medium opacity-80">×{periods}</span>}
    </span>
  );
}

/** Seconds as a clock's face writes them: 272 is 4:32. */
function faceOf(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const TONES: Record<ClockReadingState, string> = {
  free: "text-white/90",
  overtime: "text-wood",
  low: "text-danger",
  lost: "text-danger",
};
