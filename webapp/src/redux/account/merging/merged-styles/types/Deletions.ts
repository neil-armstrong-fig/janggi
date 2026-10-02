import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";

/** The latest deletion of each style, by its id. */
export type Deletions = ReadonlyMap<string, DeletedStyle>;
