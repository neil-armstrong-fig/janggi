import {DurableObject} from "cloudflare:workers";
import {closeRoomRecord} from "@src/database/rooms/CloseRoomRecord";
import type {RoomState} from "@src/room/types/RoomState";
import type {AlarmPlan} from "@src/room/alarm/types/AlarmPlan";
import type {RoomStep} from "@src/room/types/RoomStep";
import {ROOM_GONE_CLOSE_CODE} from "@janggi/shared/janggi/online/RoomGone";
import {alarmDecisionFor} from "@src/room/alarm/AlarmDecisionFor";
import {alarmPlanForRoom} from "@src/room/alarm/AlarmPlanForRoom";
import {answerFrame} from "@src/room/answering/AnswerFrame";
import {closedSocket} from "@src/room/leaving/ClosedSocket";
import {newRoom} from "@src/room/opening/NewRoom";
import {notifyTurn} from "@src/push/NotifyTurn";
import {errorNameOf} from "@src/observability/ErrorNameOf";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {observeGameRoomOperation} from "@src/room/observability/ObserveGameRoomOperation";
import {roomRequestFrom} from "@src/room/request/RoomRequestFrom";
import {turnNotificationFor} from "@src/room/notifying/TurnNotificationFor";

const STORED_ROOM = "room";
const STORED_CODE = "code";

/**
 * One friend-code game, as a Durable Object named by the code. **Only the runtime**: it reads the room from storage, asks a
 * pure function what to do (`roomRequestFrom`, `answerFrame`, `closedSocket`, `alarmPlanForRoom`, each tested apart), and
 * does it — stores the room, sends what it says to whom, sets the alarm. It decides nothing itself. `docs/online-play.md` has
 * the reasoning.
 *
 * It hibernates between messages, so **nothing is kept in a field**: whatever is not in storage is gone by the next one.
 * Each player's sockets are tagged with their account, which is how a delivery finds them and a reconnection is recognised.
 * The Worker has already checked who is calling and from where, and no one but the Worker can reach this object.
 *
 * Its observability boundaries are tested with a minimal runtime stand-in; the whole game is played by hand under `pnpm api:dev`.
 */
export class GameRoom extends DurableObject {
  private readonly context: DurableObjectState;

  constructor(context: DurableObjectState, environment: Cloudflare.Env) {
    super(context, environment);
    this.context = context;
  }

  override fetch(request: Request): Promise<Response> {
    return observeGameRoomOperation("fetch", () => this.answerRequest(request));
  }

  override webSocketMessage(socket: WebSocket, data: string | ArrayBuffer): Promise<void> {
    return observeGameRoomOperation("websocket_message", () => this.answerMessage(socket, data));
  }

  override webSocketClose(socket: WebSocket): Promise<void> {
    return observeGameRoomOperation("websocket_close", () => this.left(socket));
  }

  override async webSocketError(socket: WebSocket, error: unknown): Promise<void> {
    logApiEvent({
      event: "game_room",
      outcome: "unexpected_failure",
      operation: "websocket_error",
      errorName: errorNameOf(error),
    });

    await this.left(socket);
  }

  override alarm(): Promise<void> {
    return observeGameRoomOperation("alarm", () => this.answerAlarm());
  }

  private async answerRequest(request: Request): Promise<Response> {
    const asked = await roomRequestFrom(request);

    switch (asked.kind) {
      case "open":
        return this.open(newRoom(asked.hostSide, Date.now(), asked.awayDays), asked.code);
      case "socket":
        return this.accept(asked.accountId);
      case "malformed": {
        logApiEvent({event: "game_room", outcome: "malformed_request", status: 400});
        return new Response(undefined, {status: 400});
      }
      case "unknown": {
        logApiEvent({event: "game_room", outcome: "unknown_request", status: 404});
        return new Response(undefined, {status: 404});
      }
    }
  }

  private async answerMessage(socket: WebSocket, data: string | ArrayBuffer): Promise<void> {
    const accountId = this.accountOf(socket);
    const room = await this.stored();

    if (accountId !== undefined && room !== undefined) {
      const step = answerFrame(room, {accountId, data, now: Date.now()});

      await this.apply(step);
      this.tellWhoseTurn(room, step.state);
    }
  }

  private async answerAlarm(): Promise<void> {
    const room = await this.stored();
    if (room === undefined) {
      return;
    }

    const decision = alarmDecisionFor(room, Date.now());

    if (decision.kind === "delete") {
      await this.teardown();
    } else {
      await this.setAlarm(alarmPlanForRoom(room, Date.now()));
    }
  }

  private async open(room: RoomState, code: string): Promise<Response> {
    // The Worker only opens a code the database has just recorded as new; a second open of one that is here is a bug, and must
    // not overwrite a game.
    if ((await this.stored()) !== undefined) {
      logApiEvent({event: "game_room", outcome: "duplicate_open", status: 409});
      return new Response(undefined, {status: 409});
    }

    await this.context.storage.put({[STORED_CODE]: code, [STORED_ROOM]: room});
    await this.setAlarm(alarmPlanForRoom(room, Date.now()));
    logApiEvent({event: "game_room", outcome: "opened"});

    return new Response(undefined, {status: 204});
  }

  private async accept(accountId: string): Promise<Response> {
    // A room that is not there still takes the socket, and closes it saying so: a browser cannot read the status of a refused
    // upgrade, and a player coming back to a room that was let go must be told to stop trying, not left to retry.
    if ((await this.stored()) === undefined) {
      return this.refuse();
    }

    // A reconnection arrives before the old socket is seen to close: the old one is let go, and its close is ignored.
    this.context.getWebSockets(accountId).forEach(old => old.close(1000, "Replaced by a newer connection"));

    const {0: client, 1: server} = new WebSocketPair();
    this.context.acceptWebSocket(server, [accountId]);

    return new Response(undefined, {status: 101, webSocket: client});
  }

  private refuse(): Response {
    const {0: client, 1: server} = new WebSocketPair();
    server.accept();
    server.close(ROOM_GONE_CLOSE_CODE, "There is no such room");
    const response = new Response(undefined, {status: 101, webSocket: client});

    logApiEvent({event: "game_room", outcome: "socket_refused_missing_room"});
    return response;
  }

  private async left(socket: WebSocket): Promise<void> {
    const accountId = this.accountOf(socket);
    const room = await this.stored();

    if (accountId !== undefined && room !== undefined) {
      const stillConnected = this.context.getWebSockets(accountId).some(other => other !== socket);

      await this.apply(closedSocket({room, accountId, stillConnected, now: Date.now()}));
    }
  }

  /**
   * Tells the player a move passed the turn to, if they are away, by a push to their devices. Let run on after the move has been
   * answered: the players have what they were waiting for, and a push service that is slow costs them nothing.
   */
  private tellWhoseTurn(before: RoomState, after: RoomState): void {
    const notification = turnNotificationFor(before, after);

    if (notification !== undefined) {
      this.context.waitUntil(notifyTurn(notification));
    }
  }

  /** Stores the room a step made, sends what it says, and sets the alarm for whatever the room is now waiting on. */
  private async apply(step: RoomStep): Promise<void> {
    await this.context.storage.put(STORED_ROOM, step.state);

    for (const {to, message} of step.deliveries) {
      this.context.getWebSockets(to).forEach(socket => socket.send(JSON.stringify(message)));
    }

    await this.setAlarm(alarmPlanForRoom(step.state, Date.now()));
    await this.releaseHost(step.state);
  }

  /**
   * A finished game is no longer the host's open room, though it stays here for a while for both to see how it ended: the
   * host's claim on it is let go at once, so a code they make next is a new room and not this one handed back.
   */
  private async releaseHost(room: RoomState): Promise<void> {
    if (room.finishedAt === undefined) return;

    const code = await this.context.storage.get<string>(STORED_CODE);
    if (code === undefined) return;

    await closeRoomRecord(code);
  }

  private async setAlarm(plan: AlarmPlan): Promise<void> {
    if (plan.kind === "ring-at") {
      await this.context.storage.setAlarm(plan.at);
    } else {
      await this.context.storage.deleteAlarm();
    }
  }

  /** The room is over: its sockets are closed, its record in the database cleared so the host may open another, and its storage emptied. */
  private async teardown(): Promise<void> {
    const code = await this.context.storage.get<string>(STORED_CODE);

    this.context.getWebSockets().forEach(socket => socket.close(ROOM_GONE_CLOSE_CODE, "The room has closed"));
    if (code !== undefined) {
      await closeRoomRecord(code);
    }

    await this.context.storage.deleteAlarm();
    await this.context.storage.deleteAll();
    logApiEvent({event: "game_room", outcome: "deleted"});
  }

  private async stored(): Promise<RoomState | undefined> {
    return this.context.storage.get<RoomState>(STORED_ROOM);
  }

  private accountOf(socket: WebSocket): string | undefined {
    return this.context.getTags(socket)[0];
  }
}
