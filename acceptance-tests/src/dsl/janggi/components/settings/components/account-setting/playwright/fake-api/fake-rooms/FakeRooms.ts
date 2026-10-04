import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import type {Room} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/Room";
import type {RoomOpened} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/RoomOpened";
import type {RoomAsked} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/RoomAsked";
import type {Seat} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/Seat";
import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {ROOM_GONE_CLOSE_CODE} from "@janggi/shared/janggi/online/RoomGone";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {WebSocketRoute} from "@playwright/test";

/**
 * The room the real Worker keeps for two friends, as far as a spec can tell: it seats them, hands each the other's
 * introduction, deals the game when both have chosen, and relays what each does to both. It does not know the rules —
 * `acceptance-tests` cannot import the engine, deliberately — so it takes a move on trust. Refusing an illegal move is the
 * real room's job, and `api/` tests it. The page never offers one, so no spec could send it anyway.
 *
 * The host's army is the one they asked for, so a spec knows who moves first; the real room only gives them what they chose
 * too, and has nothing random to fake.
 */
export class FakeRooms {
  private readonly rooms = new Map<FriendCode, Room>();
  /** Devices whose sockets are held shut: a phone in a tunnel, which neither opens one nor keeps the one it had. */
  private readonly cutOff = new Set<object>();
  private created = 0;
  /** Every room a host has asked for, in order — what the app sent, for a spec to read. */
  readonly asked: RoomAsked[] = [];

  /**
   * A room for a host to sit down at, and the code to give a friend. Like the real server, a host has one open at a time
   * and is given that one back until it is finished.
   */
  create({asked, host}: {asked: RoomAsked; host: object}): RoomOpened {
    const open = [...this.rooms.values()].find(room => room.host === host && !room.finished);

    if (open !== undefined) {
      return {kind: "already-open", code: open.code};
    }

    this.created += 1;
    this.asked.push(asked);
    const code = `FAKE${2222 + this.created}` as FriendCode;

    this.rooms.set(code, {code, hostSide: asked.side, host, finished: false, seats: [], history: []});

    return {kind: "opened", code};
  }

  /** Seats a device that has opened a socket, or sends it away where the room is not there. */
  connect(socket: WebSocketRoute, code: FriendCode, device: object): void {
    const room = this.rooms.get(code);

    if (this.cutOff.has(device)) {
      void socket.close({code: 1006, reason: "connection lost"});
      return;
    }

    // Like the real room: one that is not there takes the socket and closes it saying so, which a browser can read.
    if (room === undefined || (room.seats.length === 2 && !this.seatOf(room, device))) {
      void socket.close({code: ROOM_GONE_CLOSE_CODE, reason: "no such room"});
      return;
    }

    const seat = this.seatOf(room, device) ?? this.sitDown(room, device);

    seat.socket = socket;
    socket.onMessage(message => this.hear(room, seat, JSON.parse(String(message)) as ClientMessage));
    socket.onClose(() => this.leave(room, seat, socket));
  }

  /**
   * Lets go of every room, as the real one does once both players have been away as long as the host allowed: each socket
   * still open is closed saying the room is not there, and so is every later one.
   */
  letGoOfAll(): void {
    for (const room of this.rooms.values()) {
      for (const seat of room.seats) {
        void seat.socket?.close({code: ROOM_GONE_CLOSE_CODE, reason: "The room has closed"});
      }
    }

    this.rooms.clear();
  }

  /** Holds a device's sockets shut — drops the ones it has — until `reconnect`. */
  disconnect(device: object): void {
    this.cutOff.add(device);

    for (const room of this.rooms.values()) {
      void this.seatOf(room, device)?.socket?.close({code: 1006, reason: "connection lost"});
    }
  }

  reconnect(device: object): void {
    this.cutOff.delete(device);
  }

  private sitDown(room: Room, device: object): Seat {
    const side: Side = room.seats.length === 0 ? room.hostSide : this.opposite(room.hostSide);
    const seat: Seat = {device, side, socket: undefined, introduction: undefined, setup: undefined};

    room.seats.push(seat);

    return seat;
  }

  private seatOf(room: Room, device: object): Seat | undefined {
    return room.seats.find(seat => seat.device === device);
  }

  private hear(room: Room, seat: Seat, message: ClientMessage): void {
    const other = room.seats.find(candidate => candidate !== seat);

    if (message.kind === "introduce" && seat.introduction !== undefined) {
      // Like the real room, a player already sat down is brought up to date on introducing themselves again — which
      // is what a client does first on every connection — and not on the socket opening.
      this.restore(room, seat);
    } else if (message.kind === "introduce") {
      seat.introduction = message.introduction;
      if (other?.introduction === undefined) {
        this.tell(seat, {kind: "waiting"});
      } else {
        this.tell(seat, {kind: "matched", side: seat.side, opponent: other.introduction});
        this.tell(other, {kind: "matched", side: other.side, opponent: message.introduction});
      }
    } else if (message.kind === "update-look") {
      // Like the real room: the look is kept on the seat, and passed to the other player.
      const {boardKey: _board, piecesKey: _pieces, ...named} = seat.introduction ?? {displayName: ""};

      seat.introduction = {...named, ...message.look};
      if (other !== undefined) {
        this.tell(other, {kind: "opponent-look", look: message.look});
      }
    } else if (message.kind === "choose-setup") {
      seat.setup = message.setup;
      if (other?.setup !== undefined) {
        const started = this.started(seat, other);

        this.tell(seat, started);
        this.tell(other, started);
      }
    } else {
      room.finished ||= message.action.kind === "resign";
      room.history.push({by: seat.side, action: message.action});
      this.tell(seat, {kind: "acted", by: seat.side, action: message.action});
      if (other !== undefined) {
        this.tell(other, {kind: "acted", by: seat.side, action: message.action});
      }
    }
  }

  private started(seat: Seat, other: Seat): ServerMessage {
    const han = seat.side === "han" ? seat : other;
    const cho = seat.side === "han" ? other : seat;

    return {kind: "started", hanSetup: han.setup as SetupName, choSetup: cho.setup as SetupName};
  }

  private leave(room: Room, seat: Seat, socket: WebSocketRoute): void {
    if (seat.socket !== socket) {
      return;
    }

    seat.socket = undefined;
    for (const other of room.seats) {
      if (other !== seat) {
        this.tell(other, {kind: "opponent-left"});
      }
    }
  }

  /** What a player who was away is told on their way back, and what the other is told of it. */
  private restore(room: Room, seat: Seat): void {
    const other = room.seats.find(candidate => candidate !== seat);
    if (other?.introduction === undefined) {
      this.tell(seat, {kind: "waiting"});
      return;
    }

    const han = seat.side === "han" ? seat : other;
    const cho = seat.side === "han" ? other : seat;

    this.tell(seat, {
      kind: "snapshot",
      side: seat.side,
      opponent: other.introduction,
      ...(han.setup !== undefined && cho.setup !== undefined ? {hanSetup: han.setup, choSetup: cho.setup} : {}),
      history: room.history,
    });
    this.tell(other, {kind: "opponent-back"});
  }

  private tell(seat: Seat, message: ServerMessage): void {
    seat.socket?.send(JSON.stringify(message));
  }

  private opposite(side: Side): Side {
    if (side === "han") {
      return "cho";
    }

    return "han";
  }
}
