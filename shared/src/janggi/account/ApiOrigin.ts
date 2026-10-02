/**
 * Where the sign-in and sync API lives unless a build is pointed elsewhere (`VITE_API_ORIGIN`). The app calls it
 * and the acceptance tests stand in for it at this address, so the two cannot disagree about where it is.
 */
export const API_ORIGIN = "https://api.janggi.neilarmstrong.dev";
