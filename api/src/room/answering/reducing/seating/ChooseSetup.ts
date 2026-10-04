import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import type {Seat} from "@src/room/types/Seat";
import type {Setup} from "@janggi/engine/setups/types/Setup";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SETUPS} from "@janggi/engine/setups/Setups";
import {newGame} from "@janggi/engine/NewGame";
import {otherSeat} from "@src/room/seats/OtherSeat";
import {rejected} from "@src/room/answering/reducing/Rejected";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import {seatOf} from "@src/room/seats/SeatOf";

/**
 * A player picks the arrangement of their army. It is kept from the other until both have picked, so neither answers
 * the other's; then both are shown at once and the game is dealt.
 */
export function chooseSetup(state: RoomState, accountId: string, setup: SetupName): RoomStep {
  const seat = seatOf(state, accountId);
  const opponent = otherSeat(state, accountId);
  if (seat === undefined || opponent === undefined || seat.setup !== undefined) {
    return rejected(state, accountId, "out-of-order");
  }

  const chosen: Seat = {...seat, setup};
  const seats = replaceSeat(state.seats, seat, chosen);
  if (opponent.setup === undefined) return {state: {...state, seats}, deliveries: []};

  const hanSetup = seats.find(each => each.side === "han")?.setup as SetupName;
  const choSetup = seats.find(each => each.side === "cho")?.setup as SetupName;
  const started = {kind: "started", hanSetup, choSetup} as const;

  return {
    state: {...state, seats, game: newGame(setupNamed(hanSetup), setupNamed(choSetup), "Casual")},
    deliveries: seats.map(each => ({to: each.accountId, message: started})),
  };
}

function setupNamed(name: SetupName): Setup {
  return SETUPS.find(setup => setup.name === name) as Setup;
}
