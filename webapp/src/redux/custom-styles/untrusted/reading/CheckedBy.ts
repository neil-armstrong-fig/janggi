import type {Checked} from "@src/redux/custom-styles/untrusted/types/Checked";
import {RefusedReading} from "@src/redux/custom-styles/untrusted/reading/RefusedReading";

/**
 * Runs a read built from `Reading`s and says how it went: the value, or the reason the first field that
 * failed gave. Anything else thrown is a bug rather than a bad style, and is let through.
 */
export function checkedBy<Value>(read: () => Value): Checked<Value> {
  try {
    return {kind: "accepted", value: read()};
  } catch (error) {
    if (error instanceof RefusedReading) return {kind: "refused", reason: error.message};

    throw error;
  }
}
