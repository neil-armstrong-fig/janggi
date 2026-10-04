import type {GameState} from "@janggi/engine/types/GameState";
import type {Move} from "@janggi/engine/types/Move";
import type {Resolution} from "@src/room/answering/reducing/acting/types/Resolution";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {RoomResult} from "@src/room/types/RoomResult";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import type {Seat} from "@src/room/types/Seat";
import {agreeADraw} from "@janggi/engine/drawing/AgreeADraw";
import {applyMove} from "@janggi/engine/ApplyMove";
import {callBikjang} from "@janggi/engine/bikjang/CallBikjang";
import {canAgreeADraw} from "@janggi/engine/drawing/CanAgreeADraw";
import {canCallBikjang} from "@janggi/engine/bikjang/CanCallBikjang";
import {canPass} from "@janggi/engine/passing/CanPass";
import {opponentOf} from "@janggi/engine/utils/OpponentOf";
import {outcomeOf} from "@janggi/engine/OutcomeOf";
import {pass} from "@janggi/engine/passing/Pass";
import {rejected} from "@src/room/answering/reducing/Rejected";
import {seatOf} from "@src/room/seats/SeatOf";

/**
 * Something done in the game. The room is the only judge: it asks the engine whether the action is legal and whose turn
 * it is, and an answer of no changes nothing. What is accepted is told to both players, the one who did it included,
 * which is when they see it happen. Any move, pass or call declines a draw on offer.
 */
export function act(state: RoomState, accountId: string, action: RoomAction, now: number): RoomStep {
  const seat = seatOf(state, accountId);
  if (seat === undefined || state.game === undefined) return rejected(state, accountId, "out-of-order");
  if (state.result !== undefined) return rejected(state, accountId, "game-over");

  const resolution = resolved(state, state.game, seat, action);
  if ("refusal" in resolution) return rejected(state, accountId, resolution.refusal);

  return acceptedAction(state, {seat, action, game: resolution.game, now});
}

function resolved(state: RoomState, game: GameState, seat: Seat, action: RoomAction): Resolution {
  switch (action.kind) {
    case "resign":
      return {game};
    case "offer-draw":
      return offered(state, game);
    case "accept-draw":
      return accepted(state, game, seat);
    case "pass":
      return onTurn(game, seat, canPass(game), () => pass(game));
    case "call-bikjang":
      return onTurn(game, seat, canCallBikjang(game), () => callBikjang(game));
    case "move":
      return onTurn(game, seat, true, () => movedBy(game, action.move as Move));
  }
}

/** A draw may be offered while the game is on and none is waiting for an answer. */
function offered(state: RoomState, game: GameState): Resolution {
  if (state.drawOfferedBy !== undefined || !canAgreeADraw(game)) return {refusal: "illegal"};

  return {game};
}

/** A draw may be accepted by the army it was offered to, while the game is on. */
function accepted(state: RoomState, game: GameState, seat: Seat): Resolution {
  if (state.drawOfferedBy !== opponentOf(seat.side) || !canAgreeADraw(game)) return {refusal: "illegal"};

  return {game: agreeADraw(game)};
}

function onTurn(game: GameState, seat: Seat, allowed: boolean, done: () => GameState | undefined): Resolution {
  if (game.sideToMove !== seat.side) return {refusal: "not-your-turn"};
  if (!allowed) return {refusal: "illegal"};

  const after = done();
  if (after === undefined) return {refusal: "illegal"};

  return {game: after};
}

/**
 * The game after a move, or undefined where the engine refuses it. Its refusal is a throw, since it expects only legal
 * moves from a caller that was just handed them; this input is a stranger's. The move is cast to the engine's `Move`
 * because `parseClientMessage` has already checked its points are on the board.
 */
function movedBy(game: GameState, move: Move): GameState | undefined {
  try {
    return applyMove(game, move);
  } catch {
    return undefined;
  }
}

interface Accepted {
  readonly seat: Seat;
  readonly action: RoomAction;
  readonly game: GameState;
  readonly now: number;
}

function acceptedAction(state: RoomState, {seat, action, game, now}: Accepted): RoomStep {
  const result = resultOf(game, seat, action);
  const {drawOfferedBy: _declined, ...rest} = state;
  const played: RoomState = {...rest, game, history: [...state.history, {by: seat.side, action}]};
  const next = withResult(withOffer(played, seat, action), result, now);

  return {
    state: next,
    deliveries: state.seats.map(each => ({to: each.accountId, message: {kind: "acted", by: seat.side, action}})),
  };
}

/** The room with a draw offered, where this was the offer. */
function withOffer(state: RoomState, seat: Seat, action: RoomAction): RoomState {
  if (action.kind !== "offer-draw") return state;

  return {...state, drawOfferedBy: seat.side};
}

/** The room with its result and the time it finished, where the game is over. */
function withResult(state: RoomState, result: RoomResult | undefined, now: number): RoomState {
  if (result === undefined) return state;

  return {...state, result, finishedAt: now};
}

function resultOf(game: GameState, seat: Seat, action: RoomAction): RoomResult | undefined {
  if (action.kind === "resign") return {kind: "resigned", winner: opponentOf(seat.side)};

  const outcome = outcomeOf(game);
  if (outcome.kind === "undecided") return undefined;

  return {kind: "played", outcome};
}
