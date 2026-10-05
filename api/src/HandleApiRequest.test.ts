import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {handleApiRequest} from "@src/HandleApiRequest";
import {logApiEvent} from "@src/observability/LogApiEvent";
import {routeRequest} from "@src/router/RouteRequest";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

vi.mock("@src/router/RouteRequest");

beforeEach(() => {
  workerEnvironment.GOOGLE_CLIENT_ID = "client-id";
  workerEnvironment.GOOGLE_CLIENT_SECRET = "client-secret";
  vi.mocked(routeRequest).mockResolvedValue(new Response(null, {status: 204}));
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_ID");
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_SECRET");
});

it("answers 500 and logs safe request context when required configuration is missing", async () => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_CLIENT_SECRET");

  const response = await handleApiRequest(new Request("https://api.test/api/auth/google?return=secret-return-address"));

  expect(response.status).toBe(500);
  expect(await response.json()).toEqual({});
  expect(routeRequest).not.toHaveBeenCalled();
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "GET /api/auth/google",
    transport: "http",
    outcome: "missing_configuration",
    status: 500,
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("GOOGLE_CLIENT_SECRET");
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-return-address");
});

it("logs an uncaught failure safely and rethrows the same error", async () => {
  const failure = new TypeError("session secret-token could not be read");
  vi.mocked(routeRequest).mockRejectedValue(failure);
  const request = new Request("https://api.test/api/rooms/SECRET99/socket?token=secret-token", {
    headers: {Upgrade: "websocket"},
  });

  await expect(handleApiRequest(request)).rejects.toBe(failure);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "room_socket",
    transport: "websocket",
    outcome: "unexpected_failure",
    status: 500,
    errorName: "TypeError",
  });
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("SECRET99");
  expect(JSON.stringify(vi.mocked(logApiEvent).mock.calls)).not.toContain("secret-token");
});

it("still logs an invalid encoded socket path when route recognition itself would throw", async () => {
  vi.mocked(routeRequest).mockRejectedValue(new URIError("URI malformed for secret path"));
  const request = new Request("https://api.test/api/rooms/%E0%A4%A/socket", {
    headers: {Upgrade: "websocket"},
  });

  await expect(handleApiRequest(request)).rejects.toBeInstanceOf(URIError);
  expect(logApiEvent).toHaveBeenCalledExactlyOnceWith({
    event: "api_request",
    route: "unknown",
    transport: "websocket",
    outcome: "unexpected_failure",
    status: 500,
    errorName: "URIError",
  });
});
