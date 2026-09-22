/** One thing the controls can be pointed at from the bar, as a button — an army, or every point. */
export interface TargetChoice {
  readonly name: string;
  readonly chosen: boolean;
  readonly onChoose: () => void;
}
