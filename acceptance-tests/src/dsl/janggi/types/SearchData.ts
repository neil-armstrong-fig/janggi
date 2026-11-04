export interface SearchData {
  readonly "@type"?: unknown;
  readonly name?: unknown;
  readonly inLanguage?: unknown;
  readonly applicationCategory?: unknown;
  readonly offers?: OfferData;
  /** Where a page describes more than one thing, as the guide does: the page and the game it is about. */
  readonly "@graph"?: readonly SearchData[];
}

export interface OfferData {
  readonly price?: unknown;
  readonly priceCurrency?: unknown;
}
