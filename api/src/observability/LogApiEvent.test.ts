import {expect, it, vi} from "vitest";
import {logApiEvent} from "@src/observability/LogApiEvent";

vi.unmock("@src/observability/LogApiEvent");

it("writes a successful request as an exact informational event", () => {
  const logged = vi.spyOn(console, "info").mockImplementation(() => undefined);

  logApiEvent({
    event: "api_request",
    route: "GET /api/me",
    transport: "http",
    outcome: "succeeded",
    status: 200,
  });

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "GET /api/me",
    transport: "http",
    outcome: "succeeded",
    status: 200,
  });
});

it("writes an expected rejection as an informational event", () => {
  const logged = vi.spyOn(console, "info").mockImplementation(() => undefined);

  logApiEvent({
    event: "api_request",
    route: "unknown",
    transport: "http",
    outcome: "unknown_route",
    status: 404,
  });

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "unknown",
    transport: "http",
    outcome: "unknown_route",
    status: 404,
  });
});

it("writes a returned operational failure as a warning", () => {
  const logged = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  logApiEvent({
    event: "api_request",
    route: "POST /api/rooms",
    transport: "http",
    outcome: "failed",
    status: 503,
  });

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "POST /api/rooms",
    transport: "http",
    outcome: "failed",
    status: 503,
  });
});

it("writes missing configuration as an error without naming a secret", () => {
  const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

  logApiEvent({
    event: "api_request",
    route: "GET /api/auth/google",
    transport: "http",
    outcome: "missing_configuration",
    status: 500,
  });

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "GET /api/auth/google",
    transport: "http",
    outcome: "missing_configuration",
    status: 500,
  });
  expect(JSON.stringify(logged.mock.calls)).not.toContain("GOOGLE_CLIENT_SECRET");
});

it("writes an unexpected failure as an error without arbitrary caller context", () => {
  const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const unsafeEvent = {
    event: "api_request",
    route: "room_socket",
    transport: "websocket",
    outcome: "unexpected_failure",
    status: 500,
    errorName: "TypeError",
    message: "room ABCD2345 failed for secret-token",
  } as const;

  logApiEvent(unsafeEvent);

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "room_socket",
    transport: "websocket",
    outcome: "unexpected_failure",
    status: 500,
    errorName: "TypeError",
  });
  expect(JSON.stringify(logged.mock.calls)).not.toContain("ABCD2345");
  expect(JSON.stringify(logged.mock.calls)).not.toContain("secret-token");
});

it("writes a room lifecycle transition as an informational event", () => {
  const logged = vi.spyOn(console, "info").mockImplementation(() => undefined);

  logApiEvent({event: "game_room", outcome: "opened"});

  expect(logged).toHaveBeenCalledExactlyOnceWith({event: "game_room", outcome: "opened"});
});

it("writes a room boundary failure as an error", () => {
  const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

  logApiEvent({
    event: "game_room",
    outcome: "unexpected_failure",
    operation: "websocket_message",
    errorName: "RangeError",
  });

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "game_room",
    outcome: "unexpected_failure",
    operation: "websocket_message",
    errorName: "RangeError",
  });
});
