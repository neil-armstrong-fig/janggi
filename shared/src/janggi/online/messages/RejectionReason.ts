/**
 * Why the room turned a message away. The room is the only judge — a client that disagrees is out of step, and is told to
 * look again at what it holds rather than argued with.
 */
export const REJECTION_REASONS = ["malformed", "out-of-order", "not-your-turn", "illegal", "game-over"] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];
