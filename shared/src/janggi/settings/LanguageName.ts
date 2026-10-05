/**
 * The languages the game can be read in, by their code: `en` and `ko` (한국어). The code is the id —
 * what the store keeps, a picker's test id is built from and a spec asks for — and the words a player
 * reads for it, in its own language so it can be found by someone who cannot read the rest of the page,
 * are the webapp's to say. Janggi is a Korean game, so Korean is the first of those to be added; every
 * game starts in English unless the browser says otherwise.
 */
export const LANGUAGE_NAMES = ["en", "ko"] as const;

export type LanguageName = (typeof LANGUAGE_NAMES)[number];

export const DEFAULT_LANGUAGE: LanguageName = "en";
