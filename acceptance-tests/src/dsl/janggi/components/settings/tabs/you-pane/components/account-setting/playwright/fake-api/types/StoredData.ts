/** A player's synced document as the server holds it, and the version `If-Match` is checked against. */
export interface StoredData {
  version: number;
  blob: string;
}
