/**
 * The score on one line of the engine's `info` output, in centipawns from the side to move — or
 * undefined where the line carries none.
 *
 * A forced mate has no centipawn value, so it is read as one no material count could reach, with the
 * sign saying whose mate it is. Nothing here needs the distance: a mate either way settles any
 * question the bot asks of a score.
 */
export function evaluationIn(line: string): number | undefined {
  if (!line.startsWith("info ")) return undefined;

  const parts = SCORE.exec(line);
  if (!parts) return undefined;

  const [, kind, value] = parts;
  const score = Number(value);

  return kind === "cp" ? score : Math.sign(score) * MATE_SCORE;
}

const SCORE = / score (cp|mate) (-?\d+)/;

const MATE_SCORE = 10_000;
