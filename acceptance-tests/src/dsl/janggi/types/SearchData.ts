export interface SearchData {
  readonly "@type"?: unknown;
  readonly name?: unknown;
  readonly applicationCategory?: unknown;
  readonly offers?: OfferData;
}

export interface OfferData {
  readonly price?: unknown;
  readonly priceCurrency?: unknown;
}
