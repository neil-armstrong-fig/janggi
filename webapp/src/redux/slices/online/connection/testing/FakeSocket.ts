interface SocketEvent {
  readonly data?: string;
  readonly code?: number;
}

type Listener = (event: SocketEvent) => void;

/** A WebSocket as far as `FriendConnection` uses one: it opens, hears, closes, and a test plays the server. */
export class FakeSocket {
  static readonly OPEN = 1;
  readyState = 0;
  readonly sent: string[] = [];
  readonly url: string;
  private readonly listeners = new Map<string, Listener[]>();

  constructor(url: string) {
    this.url = url;
  }

  addEventListener(type: string, listener: Listener): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(text: string): void {
    this.sent.push(text);
  }

  close(): void {
    this.readyState = 3;
  }

  /** The server accepts the connection. */
  opens(): void {
    this.readyState = FakeSocket.OPEN;
    this.emit("open", {});
  }

  /** The server says something. */
  says(text: string): void {
    this.emit("message", {data: text});
  }

  /** The connection goes, as a refusal, a drop or the room closing it would. */
  drops(code = 1006): void {
    this.readyState = 3;
    this.emit("close", {code});
  }

  private emit(type: string, event: SocketEvent): void {
    (this.listeners.get(type) ?? []).forEach(listener => listener(event));
  }
}
