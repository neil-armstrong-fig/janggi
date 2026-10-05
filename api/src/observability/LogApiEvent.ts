import type {HttpRoute} from "@src/router/http/routes/types/HttpRoute";
import type {GameRoomOperation} from "@src/observability/types/GameRoomOperation";

type ApiRequestRoute = HttpRoute | "preflight" | "room_socket" | "unknown";
type ApiTransport = "http" | "websocket";

type ExpectedRequestOutcome =
  | "preflight"
  | "unknown_route"
  | "forged_change"
  | "succeeded"
  | "rejected"
  | "sign_in_refused"
  | "invalid_socket_route"
  | "origin_rejected"
  | "unsigned"
  | "forwarded";

interface ExpectedRequestEvent {
  readonly event: "api_request";
  readonly route: ApiRequestRoute;
  readonly transport: ApiTransport;
  readonly outcome: ExpectedRequestOutcome;
  readonly status: number;
}

interface FailedRequestEvent {
  readonly event: "api_request";
  readonly route: ApiRequestRoute;
  readonly transport: ApiTransport;
  readonly outcome: "failed";
  readonly status: number;
}

interface MissingConfigurationEvent {
  readonly event: "api_request";
  readonly route: ApiRequestRoute;
  readonly transport: ApiTransport;
  readonly outcome: "missing_configuration";
  readonly status: 500;
}

interface UnexpectedRequestFailureEvent {
  readonly event: "api_request";
  readonly route: ApiRequestRoute;
  readonly transport: ApiTransport;
  readonly outcome: "sign_in_failed" | "unexpected_failure";
  readonly status: number;
  readonly errorName: string;
}

interface GameRoomLifecycleEvent {
  readonly event: "game_room";
  readonly outcome: "opened" | "socket_refused_missing_room" | "deleted";
}

interface GameRoomRejectedRequestEvent {
  readonly event: "game_room";
  readonly outcome: "malformed_request" | "unknown_request" | "duplicate_open";
  readonly status: 400 | 404 | 409;
}

interface GameRoomFailureEvent {
  readonly event: "game_room";
  readonly outcome: "unexpected_failure";
  readonly operation: GameRoomOperation;
  readonly errorName: string;
}

type ApiLogEvent =
  | ExpectedRequestEvent
  | FailedRequestEvent
  | MissingConfigurationEvent
  | UnexpectedRequestFailureEvent
  | GameRoomLifecycleEvent
  | GameRoomRejectedRequestEvent
  | GameRoomFailureEvent;

/** Emits one closed, privacy-safe application event. */
export function logApiEvent(apiLogEvent: ApiLogEvent): void {
  if (apiLogEvent.event === "api_request") {
    logApiRequest(apiLogEvent);
    return;
  }

  logGameRoom(apiLogEvent);
}

function logApiRequest(
  apiLogEvent: ExpectedRequestEvent | FailedRequestEvent | MissingConfigurationEvent | UnexpectedRequestFailureEvent,
): void {
  if ("errorName" in apiLogEvent) {
    console.error({
      event: apiLogEvent.event,
      route: apiLogEvent.route,
      transport: apiLogEvent.transport,
      outcome: apiLogEvent.outcome,
      status: apiLogEvent.status,
      errorName: apiLogEvent.errorName,
    });
    return;
  }

  const logged = {
    event: apiLogEvent.event,
    route: apiLogEvent.route,
    transport: apiLogEvent.transport,
    outcome: apiLogEvent.outcome,
    status: apiLogEvent.status,
  };
  if (apiLogEvent.outcome === "missing_configuration") {
    console.error(logged);
    return;
  }

  if (apiLogEvent.outcome === "failed") {
    console.warn(logged);
    return;
  }

  console.info(logged);
}

function logGameRoom(apiLogEvent: GameRoomLifecycleEvent | GameRoomRejectedRequestEvent | GameRoomFailureEvent): void {
  if (apiLogEvent.outcome === "unexpected_failure") {
    console.error({
      event: apiLogEvent.event,
      outcome: apiLogEvent.outcome,
      operation: apiLogEvent.operation,
      errorName: apiLogEvent.errorName,
    });
    return;
  }

  if ("status" in apiLogEvent) {
    console.warn({event: apiLogEvent.event, outcome: apiLogEvent.outcome, status: apiLogEvent.status});
    return;
  }

  console.info({event: apiLogEvent.event, outcome: apiLogEvent.outcome});
}
