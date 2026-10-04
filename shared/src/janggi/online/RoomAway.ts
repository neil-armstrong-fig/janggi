/**
 * How long, in days, a game between friends may sit with both players away before the room is let go. A game can be days or
 * weeks of one move at a time, so these are long. The API still accepts any of them from the host, but the app offers no choice and sends the default. Nothing is forfeited by
 * being away: the room is only tidied up once nobody has come back (`docs/online-play.md`).
 */
export const ROOM_AWAY_DAYS = [1, 3, 7, 14, 30, 90] as const;

export type RoomAwayDays = (typeof ROOM_AWAY_DAYS)[number];

/** A month: long enough that a friend is not a clock, short enough that abandoned rooms are let go. */
export const DEFAULT_ROOM_AWAY_DAYS: RoomAwayDays = 30;
