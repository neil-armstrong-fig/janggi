import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";

/**
 * What an element wears to be something the tour can point at, spread onto it: `{...tourTarget("controls")}`.
 * A dedicated attribute rather than the `data-testid` it may also carry, since that one is the acceptance
 * tests' contract and a rename there must not quietly take the spotlight off the page.
 */
export function tourTarget(name: TourTargetName): TourTargetAttribute {
  return {"data-tour-target": name};
}

interface TourTargetAttribute {
  readonly "data-tour-target": TourTargetName;
}
