/**
 * The styles a spec's save carries: none. The style schema is the webapp's alone to describe, so a save
 * built here fills that part of `SaveKeyJson` with the one shape that needs no knowledge of it.
 */
export interface NoCustomStyles {
  readonly boards: readonly never[];
  readonly pieceSets: readonly never[];
}
