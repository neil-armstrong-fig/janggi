/** What the page is told to keep, as its storage holds it: the key the welcome's "done" record lives under, and the record. */
export interface OnboardingKept {
  readonly key: string;
  readonly json: string;
}
