import type {FriendConnectionStatus} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {OpponentLook} from "@src/redux/online/types/OpponentLook";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Where a game against a friend stands. `state` is the room's own word for it (`FRIEND_GAME_STATES`), except `over`, which
 * `friendStateOf` also reads off the board — a checkmate, or an agreed draw, that the room never needs to say.
 *
 * While a room is joined there are two games, and the store's `game` is the one `viewing` names — the friend game, or the
 * player's own — while the other waits in `parkedGame`, played still: the room's messages go to whichever it is. The
 * device keeps the player's own whichever is on the board, rather than the friend game (`Store.ts`, `keptOnTheDevice`). Only `code` is kept on the device from this slice, so a player who closes the page
 * is put back in the room when they return.
 */
export interface FriendSliceState {
  readonly state: FriendGameState;
  readonly code: string | undefined;
  /** This player's own link to the room: separate from the game, which carries on while the link is down. */
  readonly connection: FriendConnectionStatus;
  readonly ownSide: Side | undefined;
  readonly opponent: OpponentLook | undefined;
  /** The arrangement this player has sent, so the sheet stops asking while it waits for the other's. */
  readonly chosenSetup: SetupName | undefined;
  /** Whether the last code tried was turned away — a code no room has, or one that is not a code. */
  readonly joinRefused: boolean;
  /** Why a code could not be made, if it could not — shown in the sheet and nowhere else. */
  readonly createFailed: boolean;
  readonly resignedBy: Side | undefined;
  /** Which game is on the board while a room is joined; the other is the `parkedGame`, and both go on being played. */
  readonly viewing: GameShown;
  readonly parkedGame: GameSliceState | undefined;
}
