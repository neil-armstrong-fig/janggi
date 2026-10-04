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
import {roomRequestFrom} from "@src/room/request/RoomRequestFrom";

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
 * Untested, being only the runtime: the whole is played by hand under `pnpm api:dev`.
 */
export class GameRoom extends DurableObject {
  override async fetch(request: Request): Promise<Response> {
    const asked = await roomRequestFrom(request);

    switch (asked.kind) {
      case "open":
        return this.open(newRoom(asked.hostSide, Date.now(), asked.awayDays), asked.code);
      case "socket":
        return this.accept(asked.accountId);
      case "malformed":
        return new Response(null, {status: 400});
      case "unknown":
        return new Response(null, {status: 404});
    }
  }

  override async webSocketMessage(socket: WebSocket, data: string | ArrayBuffer): Promise<void> {
    const accountId = this.accountOf(socket);
    const room = await this.stored();

    if (accountId !== undefined && room !== undefined) {
      await this.apply(answerFrame(room, {accountId, data, now: Date.now()}));
    }
  }

  override async webSocketClose(socket: WebSocket): Promise<void> {
    await this.left(socket);
  }

  override async webSocketError(socket: WebSocket): Promise<void> {
    await this.left(socket);
  }

  override async alarm(): Promise<void> {
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
      return new Response(null, {status: 409});
    }

    await this.ctx.storage.put({[STORED_CODE]: code, [STORED_ROOM]: room});
    await this.setAlarm(alarmPlanForRoom(room, Date.now()));

    return new Response(null, {status: 204});
  }

  private async accept(accountId: string): Promise<Response> {
    // A room that is not there still takes the socket, and closes it saying so: a browser cannot read the status of a refused
    // upgrade, and a player coming back to a room that was let go must be told to stop trying, not left to retry.
    if ((await this.stored()) === undefined) {
      return this.refuse();
    }

    // A reconnection arrives before the old socket is seen to close: the old one is let go, and its close is ignored.
    this.ctx.getWebSockets(accountId).forEach(old => old.close(1000, "Replaced by a newer connection"));

    const {0: client, 1: server} = new WebSocketPair();
    this.ctx.acceptWebSocket(server, [accountId]);

    return new Response(null, {status: 101, webSocket: client});
  }

  private refuse(): Response {
    const {0: client, 1: server} = new WebSocketPair();
    server.accept();
    server.close(ROOM_GONE_CLOSE_CODE, "There is no such room");

    return new Response(null, {status: 101, webSocket: client});
  }

  private async left(socket: WebSocket): Promise<void> {
    const accountId = this.accountOf(socket);
    const room = await this.stored();

    if (accountId !== undefined && room !== undefined) {
      const stillConnected = this.ctx.getWebSockets(accountId).some(other => other !== socket);

      await this.apply(closedSocket({room, accountId, stillConnected, now: Date.now()}));
    }
  }

  /** Stores the room a step made, sends what it says, and sets the alarm for whatever the room is now waiting on. */
  private async apply(step: RoomStep): Promise<void> {
    await this.ctx.storage.put(STORED_ROOM, step.state);

    for (const {to, message} of step.deliveries) {
      this.ctx.getWebSockets(to).forEach(socket => socket.send(JSON.stringify(message)));
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

    const code = await this.ctx.storage.get<string>(STORED_CODE);
    if (code === undefined) return;

    await closeRoomRecord(code);
  }

  private async setAlarm(plan: AlarmPlan): Promise<void> {
    if (plan.kind === "ring-at") {
      await this.ctx.storage.setAlarm(plan.at);
    } else {
      await this.ctx.storage.deleteAlarm();
    }
  }

  /** The room is over: its sockets are closed, its record in the database cleared so the host may open another, and its storage emptied. */
  private async teardown(): Promise<void> {
    const code = await this.ctx.storage.get<string>(STORED_CODE);

    this.ctx.getWebSockets().forEach(socket => socket.close(ROOM_GONE_CLOSE_CODE, "The room has closed"));
    if (code !== undefined) {
      await closeRoomRecord(code);
    }

    await this.ctx.storage.deleteAlarm();
    await this.ctx.storage.deleteAll();
  }

  private async stored(): Promise<RoomState | undefined> {
    return this.ctx.storage.get<RoomState>(STORED_ROOM);
  }

  private accountOf(socket: WebSocket): string | undefined {
    return this.ctx.getTags(socket)[0];
  }
}
