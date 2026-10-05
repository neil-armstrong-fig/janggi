import type {RoomState} from "@src/room/types/RoomState";
import type {TurnNotification} from "@src/room/notifying/types/TurnNotification";

/**
 * Who is to be told, after a room changed from `before` to `after`: the player the turn has just passed to, if the game goes on
 * and they are not here. A player whose socket is open was told by it and is looking at the board, so a notification is only for
 * one whose socket has closed — a phone that has been put down. A draw offered, a resignation or a game that ends passes the
 * turn to no one, and so tells no one.
 */
export function turnNotificationFor(before: RoomState, after: RoomState): TurnNotification | undefined {
  if (before.game === undefined || after.game === undefined) return undefined;
  if (after.result !== undefined) return undefined;
  if (after.game.sideToMove === before.game.sideToMove) return undefined;

  const recipient = after.seats.find(seat => seat.side === after.game?.sideToMove);
  if (recipient === undefined || recipient.goneSince === undefined) return undefined;

  const mover = after.seats.find(seat => seat !== recipient);
  if (mover === undefined) return undefined;

  return {accountId: recipient.accountId, opponentName: mover.introduction.displayName};
}
