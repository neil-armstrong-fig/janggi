/**
 * What a clock format means, since chess players will not have met overtime (초읽기) or the ×3 that counts its periods.
 * Words stay here in English until the clock is released.
 */
export function ClockExplanation(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p>5 min + 30s ×3 is 5 minutes of free time, then 3 overtime periods (초읽기) of 30 seconds each.</p>

      <p>
        Once free time runs out, each move must be made within one period. Move in time and you keep it. Let it run out
        and it is used up, and the next one starts.
      </p>

      <p>Run out of the last period and you lose on time (시간패).</p>

      <p className="text-xs text-white/60">
        On a plaque, 0:27 ×2 means 27 seconds left, with 2 periods left, including this one.
      </p>
    </div>
  );
}
