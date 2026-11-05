import type {Countdown} from "@src/audio/types/Countdown";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** When the army to move's time runs out, whether it already has, and whether the player wants it counted down. */
export interface CountdownSource {
  readonly flagDueAt: number | undefined;
  readonly outOfTime: Side | undefined;
  readonly wanted: boolean;
}

/**
 * The countdown to tick out under the army to move: its last ten seconds before the flag falls (시간패), which is
 * exactly when its clock reads low — the last seconds of its last period, or of free time with no periods to follow.
 * None while no clock is running — before the first reply, waiting to resume, or once a flag has fallen — and none
 * for a player who has turned it off, since a ticking clock is stressful for some.
 */
export function countdownOf({flagDueAt, outOfTime, wanted}: CountdownSource): Countdown | undefined {
  if (!wanted || outOfTime || flagDueAt === undefined) return undefined;

  return {endsAt: flagDueAt, cue: "countdown"};
}
