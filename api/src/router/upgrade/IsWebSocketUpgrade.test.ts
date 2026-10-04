import {isWebSocketUpgrade} from "@src/router/upgrade/IsWebSocketUpgrade";

function requestWith(headers: Record<string, string>): Request {
  return new Request("https://api.test/api/rooms/ABCD2345/socket", {headers});
}

it.each(["websocket", "WebSocket", "WEBSOCKET"])("is an upgrade when the request says %s", upgrade => {
  expect(isWebSocketUpgrade(requestWith({Upgrade: upgrade}))).toBe(true);
});

it("is not an upgrade when the request asks for nothing", () => {
  expect(isWebSocketUpgrade(requestWith({}))).toBe(false);
});

it.each(["h2c", "", "websockets", "web socket"])("is not an upgrade to %j", upgrade => {
  expect(isWebSocketUpgrade(requestWith({Upgrade: upgrade}))).toBe(false);
});
