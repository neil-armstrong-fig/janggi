import {CUSTOM_STYLES_STORAGE_KEY} from "@src/redux/custom-styles/storage/CustomStylesStorageKey";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import {customStylesFrom} from "@src/redux/custom-styles/custom-styles-from/CustomStylesFrom";
import {readJson} from "@src/redux/device-storage/ReadJson";

/**
 * The player's own styles kept on the device, each checked again as it is read back — a style is drawn
 * straight onto the board, so one that has been tampered with since it was imported is dropped.
 */
export function loadCustomStyles(storage: Pick<Storage, "getItem"> | undefined): CustomStylesSliceState {
  return customStylesFrom(readJson(storage, CUSTOM_STYLES_STORAGE_KEY));
}
