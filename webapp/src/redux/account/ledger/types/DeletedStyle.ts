import type {StyleKind} from "@janggi/shared/janggi/settings/StyleKind";

/**
 * A style the player deleted, remembered so a device that still holds it does not bring it back.
 *
 * Kept for good: each is a few bytes, and forgetting one lets a device that has been offline for a year resurrect
 * what was deleted in the meantime.
 */
export interface DeletedStyle {
  readonly kind: StyleKind;
  readonly id: string;
  readonly at: number;
}
