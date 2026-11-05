import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clockFaceOf} from "@src/react/pages/game/clock-face/ClockFaceOf";
import {clockReadingFor} from "@src/redux/clock/selecting/ClockReadingFor";
import {clsx} from "clsx";
import {shallowEqual} from "react-redux";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * One army's time in the resume dialog, written as its plaque writes it, with the army to move lit. Nothing runs while
 * the dialog is up, so the hour it is read at does not matter: the army to move reads what its turn had spent, the other
 * what it has banked.
 */
interface Props {
  readonly side: Side;
  readonly name: string;
  readonly toMove: boolean;
}

export function ResumeClock({side, name, toMove}: Props): React.JSX.Element | undefined {
  const clockReading = useAppSelector(rootState => clockReadingFor(rootState, side, 0), shallowEqual);
  if (!clockReading) return undefined;

  const {state, seconds, periods} = clockReading;

  return (
    <div
      data-testid={`resume-game-clock-${side}`}
      data-seconds={seconds}
      data-periods={periods}
      className={clsx(
        "flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2",
        toMove && "border-gold/60 bg-black/30",
        !toMove && "border-white/10",
      )}
    >
      <span className={clsx("text-xs", toMove && "text-white/80", !toMove && "text-white/50")}>{name}</span>

      <span
        className={clsx(
          "text-xl font-semibold whitespace-nowrap tabular-nums",
          toMove && "text-white",
          !toMove && "text-white/50",
        )}
      >
        {clockFaceOf(seconds)}

        {state !== "free" && periods > 0 && <span className="ml-1 text-sm font-medium opacity-80">×{periods}</span>}
      </span>
    </div>
  );
}
