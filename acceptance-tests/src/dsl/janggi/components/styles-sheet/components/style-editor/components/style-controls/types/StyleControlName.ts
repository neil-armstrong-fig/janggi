/**
 * The controls of the style editor a spec turns, spelled out rather than built from a display name: a
 * name computed the way the webapp computes its test ids would agree with the webapp whatever either did.
 *
 * Only the controls a spec is about are listed; the editor has more.
 */
export type StyleControlName =
  | "line-colour"
  | "line-width"
  | "surface-colour"
  | "bikjang-colour"
  | "bikjang-width"
  | "check-colour"
  | "piece-size"
  | "piece-fill";
