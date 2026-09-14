import type {Unchecked} from "@src/redux/untrusted/types/Unchecked";

/** Whether a value read from outside is a plain JSON object — not null, and not an array. */
export function isObject(value: unknown): value is Unchecked {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
