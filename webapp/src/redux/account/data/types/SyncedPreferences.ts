import type {SyncedPreferenceValues} from "@src/redux/preferences/synced/types/SyncedPreferenceValues";

/** The preferences that follow the player between devices, and when they last chose any of them. */
export interface SyncedPreferences {
  readonly value: SyncedPreferenceValues;
  readonly at: number;
}
