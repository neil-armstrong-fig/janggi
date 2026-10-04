import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {Look} from "@janggi/shared/janggi/online/messages/Look";
import type {FriendRoomHandlers} from "@src/redux/online/connection/types/FriendRoomHandlers";
import type {FriendRoomVisit} from "@src/redux/online/connection/types/FriendRoomVisit";
import type {SocketFactory} from "@src/redux/online/connection/types/SocketFactory";
import {ROOM_GONE_CLOSE_CODE} from "@janggi/shared/janggi/online/RoomGone";
import {serverMessageFrom} from "@src/redux/online/wire/ServerMessageFrom";
import {serverUrl} from "@src/redux/account/server/ServerUrl";

/** The first wait before trying again, doubling to the longest; short, because a drop on a phone is usually a moment. */
const FIRST_RETRY_MS = 250;
const LONGEST_RETRY_MS = 15_000;

/** Tries a returning player makes in a row, without hearing a word, before the room is taken to be gone (about two minutes in all). */
const RETURNING_ATTEMPTS = 12;

const defaultSocket: SocketFactory = url => new WebSocket(url);

/**
 * The player's one socket to a room, kept open for them. It says who the player is as **the first thing on every
 * connection**, not only the first: the room clears the player's absence, and brings them up to date, only when they
 * introduce themselves, so a socket that opened without doing so would leave them marked away.
 *
 * A socket the room closes saying it is not there (`ROOM_GONE_CLOSE_CODE`) is never retried, first try or not: the room was
 * let go, and the player is told so. A first try is not repeated. A socket that closes before the room has said anything is a room that is not there — the
 * server cannot say why in a WebSocket's own words — and the player is told so. Once the room has spoken, or where the player
 * was coming back to it, a close is a drop, and is tried again with a growing wait.
 *
 * Holds no state the store needs: what the room says goes to the handlers, which dispatch it.
 */
export class FriendConnection {
  private readonly makeSocket: SocketFactory;
  private socket: WebSocket | undefined;
  private visit: FriendRoomVisit | undefined;
  private handlers: FriendRoomHandlers | undefined;
  /** The look the player wears now, which a socket opened after a drop introduces them with instead of the one they came in wearing. */
  private look: Look | undefined;
  private heard = false;
  /** Whether the room has spoken on the socket now open. */
  private up = false;
  private failures = 0;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(makeSocket: SocketFactory = defaultSocket) {
    this.makeSocket = makeSocket;
  }

  /** Opens the connection to a room, ending any other the player had. */
  open(visit: FriendRoomVisit, handlers: FriendRoomHandlers): void {
    this.close();

    this.visit = visit;
    this.handlers = handlers;
    this.look = undefined;
    this.heard = false;
    this.up = false;
    this.failures = 0;
    this.connect();
  }

  /** Says something to the room, if the socket is up. A message sent into a drop is not queued: the room is the authority, and the player acts again on what it says when they are back. */
  send(message: ClientMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message));
  }

  /** Tells the room the player now wears another board or set of pieces, and keeps it for the next time they introduce themselves. */
  wear(look: Look): void {
    this.look = look;
    this.send({kind: "update-look", look});
  }

  /** Lets go of the room, and does not come back to it. */
  close(): void {
    clearTimeout(this.retryTimer);
    this.retryTimer = undefined;
    this.visit = undefined;
    this.handlers = undefined;

    const socket = this.socket;
    this.socket = undefined;
    socket?.close();
  }

  private connect(): void {
    const visit = this.visit;
    if (visit === undefined) return;

    const socket = this.makeSocket(serverUrl(`/api/rooms/${visit.code}/socket`).replace(/^http/, "ws"));
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.send({kind: "introduce", introduction: this.introductionFor(visit)});
    });
    socket.addEventListener("message", event => this.heardFrom(socket, String(event.data)));
    socket.addEventListener("close", event => this.closed(socket, event.code));
  }

  private introductionFor({introduction}: FriendRoomVisit): Introduction {
    if (this.look === undefined) return introduction;

    return {displayName: introduction.displayName, ...this.look};
  }

  private heardFrom(socket: WebSocket, text: string): void {
    const message = serverMessageFrom(text);
    if (socket !== this.socket || message === undefined) return;

    const wasDown = !this.up;

    this.heard = true;
    this.up = true;
    this.failures = 0;
    if (wasDown) this.handlers?.onConnected();
    this.handlers?.onMessage(message);
  }

  private closed(socket: WebSocket, code: number): void {
    if (socket !== this.socket) return;

    const handlers = this.handlers;
    const returning = this.visit?.returning === true || this.heard;

    // The room says it is not there — never made, or let go: there is nothing to come back to, so no retry.
    if (code === ROOM_GONE_CLOSE_CODE) {
      this.close();
      if (returning) {
        handlers?.onGaveUp();
      } else {
        handlers?.onRefused();
      }

      return;
    }

    if (!returning) {
      this.close();
      handlers?.onRefused();

      return;
    }

    this.up = false;
    handlers?.onReconnecting();
    this.failures += 1;
    if (!this.heard && this.failures >= RETURNING_ATTEMPTS) {
      this.close();
      handlers?.onGaveUp();

      return;
    }

    this.retryTimer = setTimeout(() => this.connect(), this.waitBefore(this.failures));
  }

  private waitBefore(failures: number): number {
    return Math.min(FIRST_RETRY_MS * 2 ** (failures - 1), LONGEST_RETRY_MS);
  }
}
