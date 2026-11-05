import type {ClockedState} from "@src/redux/clock/types/ClockedState";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import {timeControlOf} from "@src/redux/clock/time-controls/TimeControlOf";
import {withAFriend} from "@src/redux/online/selecting/WithAFriend";

/**
 * The format this game is played to, if it has one. Only two people at one device have one: the bot moves almost at
 * once, which would make the clocks unfair, and time in a game with a friend has to be the room's to keep.
 */
export function clockInUse({clock, friend, game}: ClockedState): TimeControl | undefined {
  if (game.opponent.name !== "Human" || withAFriend(friend)) return undefined;

  return timeControlOf(clock.name, clock.custom);
}
