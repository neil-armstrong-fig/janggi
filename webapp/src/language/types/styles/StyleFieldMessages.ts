/** What the editor's fields say of themselves. Each screen-reader label is whole, built from the field's own. */
export interface StyleFieldMessages {
  readonly plainColour: string;
  readonly notAColour: string;
  readonly howSolid: (label: string) => string;
  readonly asNumber: (label: string) => string;
  readonly on: string;
  readonly off: string;
}
