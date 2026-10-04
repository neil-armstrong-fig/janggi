import type {GameState} from "@janggi/engine/types/GameState";
import type {RoomAwayDays} from "@janggi/shared/janggi/online/RoomAway";
import type {RoomResult} from "@src/room/types/RoomResult";
import type {Seat} from "@src/room/types/Seat";
import type {SeatedAction} from "@janggi/shared/janggi/online/messages/action/SeatedAction";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Everything a room knows, as plain data that survives `JSON.stringify`: a Durable Object that hibernates is rebuilt
 * from storage on the next message, so nothing may live anywhere else (`docs/online-play.md`).
 *
 * The game is kept as the engine's own state alongside the list of what was done. The list is for the player who
 * reconnects; the state is so a move is judged without replaying the whole game inside a 10 ms CPU budget.
 */
export interface RoomState {
  readonly hostSide: Side;
  /** How many days both players may be away before the room is let go; the host chose. */
  readonly awayDays: RoomAwayDays;
  readonly createdAt: number;
  /** In the order they sat down: the host first. */
  readonly seats: readonly Seat[];
  readonly game?: GameState;
  readonly history: readonly SeatedAction[];
  /** The army that has offered a draw the other has not yet answered. */
  readonly drawOfferedBy?: Side;
  readonly result?: RoomResult;
  readonly finishedAt?: number;
}
