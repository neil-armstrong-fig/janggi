import type {CustomStylesSliceState} from "@src/redux/slices/custom-styles/types/CustomStylesSliceState";

/** A player who has made and been given nothing yet. */
export function noCustomStyles(): CustomStylesSliceState {
  return {boards: [], pieceSets: []};
}
