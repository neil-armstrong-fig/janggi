import type {BeatenLadders} from "@janggi/shared/janggi/progress/BeatenLadders";

/**
 * The shape of the four ladders lives in `@janggi/shared`, being also the shape a save key carries — and
 * the acceptance tests build save keys against it. It is passed on from here so the progress slice's own
 * users keep reading it where they always have.
 */
export type {BeatenBySide, BeatenElos, BeatenLadders} from "@janggi/shared/janggi/progress/BeatenLadders";

/**
 * How far the player has come: the XP that every decided game against the bot has earned them, and which
 * strengths of bot they have beaten on each ladder.
 *
 * **Stored rather than worked out from the record.** Starting the record again must not take the unlocks
 * away with it, and a player editing the number by hand is a way to the last theme the game means to
 * leave open — so it is a number kept on the device, not a sum over the games behind it.
 */
export interface ProgressSliceState {
  readonly xp: number;
  readonly beaten: BeatenLadders;
}
