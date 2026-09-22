/** What an SVG is drawn on: the rectangle of its own units that its viewBox, or its width and height, describes. */
export interface Size {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
