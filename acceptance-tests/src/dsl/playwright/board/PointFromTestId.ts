import type {Point} from "@src/dsl/janggi/components/types/Point";

/** Reads the composed cell-id contract without accepting a missing or unrelated element. */
export function pointFromTestId(testId?: string): Point {
  const [, file, rank] = /^cell-f(\d+)r(\d+)$/.exec(testId ?? "") ?? [];
  if (file === undefined || rank === undefined) throw new Error(`Expected a cell's test id, got ${testId}`);

  return {file: Number(file), rank: Number(rank)};
}
