/**
 * How much of a piece set to copy into the one being made: all of it, or only one army's pieces — Han's look
 * from one set on the pieces the controls are changing, for instance. Listed as well as typed, so the choice is
 * read off the list.
 */
export const COPY_SCOPES = ["both", "han", "cho"] as const;

export type CopyScope = (typeof COPY_SCOPES)[number];
