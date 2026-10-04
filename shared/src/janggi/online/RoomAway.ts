/**
 * How long, in days, a game between friends may sit with both players away before the room is let go. A game can be days or
 * weeks of one move at a time, so these are long, and **the host chooses** when they make the code. Nothing is forfeited by
 * being away: the room is only tidied up once nobody has come back (`docs/online-play.md`).
 */
export const ROOM_AWAY_DAYS = [1, 3, 7, 14, 30, 90] as const;

export type RoomAwayDays = (typeof ROOM_AWAY_DAYS)[number];

/** The longest on offer, because a friend is not a clock. */
export const DEFAULT_ROOM_AWAY_DAYS: RoomAwayDays = 90;
