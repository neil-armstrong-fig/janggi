export const YOU_GROUP_NAMES = ["Account", "SaveTransfer"] as const;

export type YouGroupName = (typeof YOU_GROUP_NAMES)[number];
