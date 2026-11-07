/** Whether the player has asked for an account on this device, and how far that has got. */
export const ACCOUNT_STATUSES = ["signed-out", "signing-in", "signed-in"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
