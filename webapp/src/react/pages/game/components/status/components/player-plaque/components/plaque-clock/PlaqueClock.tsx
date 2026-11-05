import type {ClockReadingState} from "@src/redux/clock/reading/types/ClockReadingState";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockFaceOf} from "@src/react/pages/game/clock-face/ClockFaceOf";
import {clockReadingFor} from "@src/redux/clock/selecting/ClockReadingFor";
import {clsx} from "clsx";
import {shallowEqual} from "react-redux";
import {useAppSelector} from "@src/redux/Hooks";
import {useClockNow} from "@src/react/pages/game/components/status/components/player-plaque/components/plaque-clock/hooks/use-clock-now/UseClockNow";

/**
 * One army's clock on its plaque, beside its score, in a game that has one: minutes and seconds, and once the free
 * time has gone, the periods left. The army to move is lit, as its plaque is.
 *
 * It works out what it shows from when the turn began, so time passing redraws this and nothing else. Its words are drawn
 * from figures, so there is nothing here to translate.
 */
interface Props {
  readonly side: Side;
}

export function PlaqueClock({side}: Props): React.JSX.Element | undefined {
  const now = useClockNow(side);
  const toMove = useAppSelector(rootState => rootState.game.played.present.sideToMove === side);
  const clockReading = useAppSelector(rootState => clockReadingFor(rootState, side, now), shallowEqual);
  if (!clockReading) return undefined;

  const {state, seconds, periods} = clockReading;

  return (
    <span
      data-testid={`clock-${side}`}
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
      {clockFaceOf(seconds)}

      {state !== "free" && periods > 0 && <span className="ml-1 text-xs font-medium opacity-80">×{periods}</span>}
    </span>
  );
}

const TONES: Record<ClockReadingState, string> = {
  free: "text-white/90",
  overtime: "text-wood",
  low: "text-danger",
  lost: "text-danger",
};
