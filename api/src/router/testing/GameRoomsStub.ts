import type {Mock} from "vitest";
import {vi} from "vitest";

/** What the Worker asked of one room's Durable Object: which room (by its code), and the call. */
type RoomCall = (code: string, input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface GameRoomsStub {
  /** Assign to `workerEnvironment.GAME_ROOMS`. */
  readonly namespace: DurableObjectNamespace;
  /** Every call made to a room, and what the room answers: 200 unless the test says otherwise. */
  readonly roomCalled: Mock<RoomCall>;
}

/**
 * A stand-in for the `GAME_ROOMS` binding, so the code that reads it is the code that runs in the Worker, and the test does the
 * stubbing: `idFromName` names the room by its code, and `get` hands back a stub whose `fetch` is a mock to read and to steer.
 */
export function gameRoomsStub(): GameRoomsStub {
  const roomCalled = vi.fn<RoomCall>(() => Promise.resolve(new Response(undefined, {status: 200})));
  const namespace = {
    idFromName: (name: string) => name,
    get: (code: string) => ({fetch: (input: RequestInfo | URL, init?: RequestInit) => roomCalled(code, input, init)}),
  };

  return {namespace: namespace as unknown as DurableObjectNamespace, roomCalled};
}
