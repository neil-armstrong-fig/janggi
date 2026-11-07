/**
 * The most games of each format the server keeps. A record only grows, and a document that grew without limit would
 * one day be past what a row can hold; the device keeps every game, and a new device takes the latest of them.
 */
export const MAX_SYNCED_GAMES_PER_FORMAT = 1000;
