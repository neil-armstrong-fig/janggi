import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {createAction} from "@reduxjs/toolkit";

/** The other game was brought to the board: it is `incoming`, and the one that was there waits as `outgoing`. */
export interface SwappedGames {
  readonly incoming: GameSliceState;
  readonly outgoing: GameSliceState;
  readonly shown: GameShown;
}

export const gamesSwapped = createAction<SwappedGames>("friend/gamesSwapped");
