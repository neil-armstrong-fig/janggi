/** Calls `mapper` `times` times, collecting the results. */
export function repeatMap<T>(times: number, mapper: (index: number) => T): T[] {
  return Array.from({length: times}, (_, index) => mapper(index));
}
