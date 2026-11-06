/** Why what a player pasted, wrote or chose will not do. The checker's notes on one field of a style's JSON (`Reading`) are not here: they name a place in the JSON, sync and saves share them, and they stay as they are (`docs/localisation.md`). */
export interface StyleRefusalMessages {
  readonly notAKey: string;
  readonly giveAName: string;
  readonly nameTaken: (name: string) => string;
  readonly notJson: (detail: string) => string;
  readonly notOneObject: string;
  readonly notSvg: string;
  readonly svgTransform: string;
  readonly svgNoSize: string;
  readonly svgNoShapes: string;
  readonly svgBadPath: string;
  readonly svgTooDetailed: string;
}
