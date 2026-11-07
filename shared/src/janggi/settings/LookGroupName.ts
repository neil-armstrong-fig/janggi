export const LOOK_GROUP_NAMES = ["Board", "Pieces", "BoardHints"] as const;

export type LookGroupName = (typeof LOOK_GROUP_NAMES)[number];
