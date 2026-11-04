/** What the settings sheet itself says, apart from what is in its tabs. */
export interface SettingsMessages {
  readonly closeLabel: string;
  readonly tabsLabel: string;
  readonly notYetChosen: string;
  readonly back: string;
  /** The label of the (?) beside a picker, handed what the picker is called. */
  readonly whatEachMeans: (label: string) => string;
}
