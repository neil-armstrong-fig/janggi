import type {Checked} from "@src/redux/slices/custom-styles/untrusted/types/Checked";
import type {CustomStylesSliceState} from "@src/redux/slices/custom-styles/types/CustomStylesSliceState";
import {boardStyleFrom} from "@src/redux/slices/custom-styles/untrusted/BoardStyleFrom";
import {isObject} from "@src/redux/shared/untrusted/IsObject";
import {noCustomStyles} from "@src/redux/slices/custom-styles/no-custom-styles/NoCustomStyles";
import {pieceSetStyleFrom} from "@src/redux/slices/custom-styles/untrusted/PieceSetStyleFrom";

/**
 * A player's own styles read from outside — the device's storage, or a save key — keeping every style
 * that checks out and dropping, one at a time, each that does not. One broken style is no reason to lose
 * the rest.
 */
export function customStylesFrom(value: unknown): CustomStylesSliceState {
  if (!isObject(value)) return noCustomStyles();

  return {
    boards: acceptedIn(value["boards"], boardStyleFrom),
    pieceSets: acceptedIn(value["pieceSets"], pieceSetStyleFrom),
  };
}

function acceptedIn<Style>(value: unknown, check: (style: unknown) => Checked<Style>): readonly Style[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((style: unknown) => {
    const checked = check(style);
    if (checked.kind === "accepted") {
      return [checked.value];
    }

    return [];
  });
}
