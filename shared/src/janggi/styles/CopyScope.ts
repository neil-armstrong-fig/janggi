/**
 * How much of a piece set to copy into the one being made: all of it, or only one army's pieces.
 * Here rather than in the webapp because the words for each are in `language/`, which reaches nothing but this package.
 */
export const COPY_SCOPES = ["both", "han", "cho"] as const;

export type CopyScope = (typeof COPY_SCOPES)[number];
