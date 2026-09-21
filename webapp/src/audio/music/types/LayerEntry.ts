/** How many seconds after the music starts a layer may begin to rise, and how slowly it does. */
export interface LayerEntry {
  readonly after: number;
  readonly rise: number;
}
