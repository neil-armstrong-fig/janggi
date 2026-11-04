/** Changing the display name: the form, and the answer to what was tried. */
export interface YouNameMessages {
  readonly label: string;
  readonly placeholder: string;
  readonly save: string;
  /** Said of a name that cannot be one, given the longest a name may be. */
  readonly badLength: (longest: number) => string;
  readonly notAllowed: string;
  readonly couldNotChange: string;
  readonly changed: string;
}
