import type {Seat} from "@src/room/types/Seat";

/** The seats with one of them put in the place of another: the one that was there, by identity, and nothing else changed. */
export function replaceSeat(seats: readonly Seat[], seat: Seat, replacement: Seat): readonly Seat[] {
  return seats.map(each => {
    if (each === seat) return replacement;

    return each;
  });
}
