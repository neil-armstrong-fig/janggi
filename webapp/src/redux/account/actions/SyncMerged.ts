import type {SyncData} from "@src/redux/account/data/types/SyncData";
import {createAction} from "@reduxjs/toolkit";

/**
 * What the server held, merged into what the device held — the result of a sync, **replacing** the progress, the
 * player's own styles, the record's games and the preferences with it.
 *
 * Replacing rather than adding, as a loaded save key does, because a merge can take things away: a style deleted
 * on another device is gone from the result, and adding the result to what is here would put it back.
 */
export const syncMerged = createAction<SyncData>("account/syncMerged");
