import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {WebSocketRoute} from "@playwright/test";

/** One player at a room: the device they sit at, the socket it holds (none while it is away), and what they have said. */
export interface Seat {
  readonly device: object;
  readonly side: Side;
  socket: WebSocketRoute | undefined;
  introduction: Introduction | undefined;
  setup: SetupName | undefined;
}
