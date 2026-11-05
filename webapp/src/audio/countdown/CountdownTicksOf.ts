import type {CountdownTick} from "@src/audio/countdown/types/CountdownTick";

/**
 * The ticks of the last ten seconds before a deadline, first to last: one as each second begins — the moment a clock
 * that rounds up turns to show it — and none at the deadline itself, which has a sound of its own. Each is struck
 * harder than the one before, the last at full weight.
 */
export function countdownTicksOf(endsAt: number): readonly CountdownTick[] {
  return Array.from({length: COUNTDOWN_SECONDS}, (_, index) => {
    const secondsLeft = COUNTDOWN_SECONDS - index;

    return {at: endsAt - secondsLeft * 1000, weight: (index + 1) / COUNTDOWN_SECONDS};
  });
}

const COUNTDOWN_SECONDS = 10;
