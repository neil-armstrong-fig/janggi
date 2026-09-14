/**
 * How long one step of the music lasts, in seconds, for how tense the game is and whether a general is
 * under attack.
 *
 * The game's own music moves at the pace of court music — a slow, spacious crawl at the opening, each
 * step well over half a second — and quickens as the game does, never past a steady walk: this is
 * music to think over, and a player may sit on a move for minutes.
 *
 * The check theme keeps a pace of its own, faster than anything the court music reaches, quickening
 * with tension too. It is the pace the check theme was written at, and is kept exactly.
 */
export function secondsPerStep(tension: number, inCheck: boolean): number {
  const bpm = inCheck
    ? CHECK_CALM_BPM + (CHECK_TENSE_BPM - CHECK_CALM_BPM) * tension
    : COURT_CALM_BPM + (COURT_TENSE_BPM - COURT_CALM_BPM) * tension;

  return 60 / bpm / 2;
}

/** Beats a minute for the game's own music at the opening, and once the game is as tense as it gets. */
const COURT_CALM_BPM = 42;
const COURT_TENSE_BPM = 66;

/** Beats a minute for the check theme, at the opening and at its tensest. */
const CHECK_CALM_BPM = 74;
const CHECK_TENSE_BPM = 96;
