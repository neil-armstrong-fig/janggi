import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

/** A style as the editor holds it to be saved: its kind, the name from the box, and the JSON for the rest. */
export interface WrittenStyle {
  readonly styleKind: StyleKind;
  readonly name: string;
  readonly json: string;
}
