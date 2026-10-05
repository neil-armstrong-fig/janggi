import {GameRoom} from "@src/room/GameRoom";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

const ROOM = "https://game-room";
const CODE = "ABCD2345";

interface GameRoomHarness {
  readonly context: DurableObjectState;
  readonly values: Map<string, unknown>;
}

it("logs a room being opened without its code or state", async () => {
  const gameRoomHarness = harness();
  const gameRoom = new GameRoom(gameRoomHarness.context, workerEnvironment);

  const response = await gameRoom.fetch(openRequest());

  expect(response.status).toBe(204);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({event: "game_room", outcome: "opened"});
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain(CODE);
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("hostSide");
});

it("logs a duplicate opening as an operational rejection", async () => {
  const gameRoom = new GameRoom(harness().context, workerEnvironment);
  await gameRoom.fetch(openRequest());
  vi.mocked(logApiEvent).mockClear();

  const response = await gameRoom.fetch(openRequest());

  expect(response.status).toBe(409);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "game_room",
    outcome: "duplicate_open",
    status: 409,
  });
});

it.each([
  ["malformed", new Request(`${ROOM}/open`, {method: "POST", body: "{"}), "malformed_request", 400],
  ["unknown", new Request(`${ROOM}/anything`), "unknown_request", 404],
] as const)("logs a %s internal request without its contents", async (_kind, request, outcome, status) => {
  const gameRoom = new GameRoom(harness().context, workerEnvironment);

  const response = await gameRoom.fetch(request);

  expect(response.status).toBe(status);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({event: "game_room", outcome, status});
});

it("logs when a socket is accepted only to say its room is gone", async () => {
  const request = new Request(`${ROOM}/socket`, {headers: {"X-Account-Id": "secret-account"}});
  const close = vi.fn();
  vi.stubGlobal("WebSocketPair", function () {
    return {0: {}, 1: {accept: vi.fn(), close}};
  });
  vi.stubGlobal("Response", function (_body: BodyInit | null, init?: ResponseInit) {
    return {status: init?.status};
  });

  try {
    const gameRoom = new GameRoom(harness().context, workerEnvironment);

    const response = await gameRoom.fetch(request);

    expect(response.status).toBe(101);
    expect(close).toHaveBeenCalledOnce();
    expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
      event: "game_room",
      outcome: "socket_refused_missing_room",
    });
    expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-account");
  } finally {
    vi.unstubAllGlobals();
  }
});

it("logs an alarm-driven teardown after it has completed", async () => {
  const gameRoomHarness = harness();
  const gameRoom = new GameRoom(gameRoomHarness.context, workerEnvironment);
  await gameRoom.fetch(openRequest());
  vi.mocked(logApiEvent).mockClear();
  vi.setSystemTime(new Date(Date.now() + 24 * 60 * 60 * 1_000 + 1));

  await gameRoom.alarm();

  expect(gameRoomHarness.values.size).toBe(0);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({event: "game_room", outcome: "deleted"});
});

it("logs a Durable Object boundary failure without its message and rethrows it", async () => {
  const failure = new TypeError("room ABCD2345 contains secret state");
  const gameRoomHarness = harness();
  vi.mocked(gameRoomHarness.context.storage.get).mockRejectedValueOnce(failure);
  const gameRoom = new GameRoom(gameRoomHarness.context, workerEnvironment);

  await expect(gameRoom.alarm()).rejects.toBe(failure);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "game_room",
    outcome: "unexpected_failure",
    operation: "alarm",
    errorName: "TypeError",
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("ABCD2345");
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret state");
});

it("logs the exception class delivered to the WebSocket error boundary", async () => {
  const gameRoomHarness = harness();
  const socket = {} as WebSocket;
  vi.mocked(gameRoomHarness.context.getTags).mockReturnValue([]);
  const gameRoom = new GameRoom(gameRoomHarness.context, workerEnvironment);

  await gameRoom.webSocketError(socket, new RangeError("secret socket detail"));

  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "game_room",
    outcome: "unexpected_failure",
    operation: "websocket_error",
    errorName: "RangeError",
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret socket detail");
});

function openRequest(): Request {
  return new Request(`${ROOM}/open`, {
    method: "POST",
    body: JSON.stringify({code: CODE, hostSide: "han", awayDays: 30}),
  });
}

function harness(): GameRoomHarness {
  const values = new Map<string, unknown>();
  const storage = {
    get: vi.fn((key: string) => Promise.resolve(values.get(key))),
    put: vi.fn((key: string | Record<string, unknown>, value?: unknown) => {
      if (typeof key === "string") {
        values.set(key, value);
      } else {
        Object.entries(key).forEach(([name, held]) => values.set(name, held));
      }

      return Promise.resolve();
    }),
    setAlarm: vi.fn(() => Promise.resolve()),
    deleteAlarm: vi.fn(() => Promise.resolve()),
    deleteAll: vi.fn(() => {
      values.clear();

      return Promise.resolve();
    }),
  };
  const context = {
    storage,
    getWebSockets: vi.fn(() => []),
    getTags: vi.fn(() => []),
    acceptWebSocket: vi.fn(),
    waitUntil: vi.fn(),
  };

  return {context: context as unknown as DurableObjectState, values};
}
