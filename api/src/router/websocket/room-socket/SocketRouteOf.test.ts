import {socketRouteOf} from "@src/router/websocket/room-socket/SocketRouteOf";

it("takes the code from a room's socket path", () => {
  expect(socketRouteOf("/api/rooms/ABCD2345/socket")).toBe("ABCD2345");
});

it.each(["abcd2345", "abcd-2345", "ABCD-2345", "abcd%202345"])("reads the code %s as a friend would", typed => {
  expect(socketRouteOf(`/api/rooms/${typed}/socket`)).toBe("ABCD2345");
});

it.each([
  "/api/rooms/SHORT/socket",
  "/api/rooms/0000000O/socket",
  "/api/rooms/ABCDEFGH1/socket",
  "/api/rooms//socket",
  "/api/rooms/ABCD2345/socket/more",
  "/api/rooms/AB/CD/socket",
  "/api/rooms/ABCD2345",
  "/api/me",
  "/",
])("has no code in %s", pathname => {
  expect(socketRouteOf(pathname)).toBeUndefined();
});
