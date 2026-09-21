/** The move a `bestmove` line names, exactly as written — or undefined for any other line. */
export function bestMoveIn(line: string): string | undefined {
  const parts = BEST_MOVE.exec(line);

  return parts?.[1];
}

const BEST_MOVE = /^bestmove (\S+)/;
