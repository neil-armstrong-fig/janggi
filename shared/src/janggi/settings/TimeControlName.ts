/**
 * What the clock is set to: none at all, one of the formats on offer, or one the player writes out.
 *
 * Every format on offer is 30 seconds three times over, the 초읽기 the sources agree on most; what differs between them
 * is the free time before it.
 */
export const TIME_CONTROL_NAMES = ["Off", "5 min", "10 min", "20 min", "Custom"] as const;

export type TimeControlName = (typeof TIME_CONTROL_NAMES)[number];

export const DEFAULT_TIME_CONTROL: TimeControlName = "Off";
