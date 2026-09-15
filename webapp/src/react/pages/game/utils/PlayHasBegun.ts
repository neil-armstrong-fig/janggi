import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * Whether a turn has been taken in this game — a move played or a turn rested, both of which leave a
 * position behind in the record.
 *
 * It is what locks the two setup pickers: a back rank is arranged strictly before play, so once
 * anything has been played neither may be used. Derived off `played.past` rather than counted into
 * the slice, so it falls again as the game is taken back — otherwise a board returned to its
 * starting position would sit there with the arrangement that produced it out of reach.
 *
 * It is also when the music stops waiting and becomes the game's own, which is why it sits with the
 * page rather than with the settings: setting a game up is heard as the waiting theme, and a game
 * taken back to its start is heard waiting again.
 */
export function playHasBegun(played: PlayedGame): boolean {
  return played.past.length > 0;
}
