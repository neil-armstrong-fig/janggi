import {HTTP_ROUTES} from "@src/router/http/routes/types/HttpRoute";
import {httpRouteOf} from "@src/router/http/routes/HttpRouteOf";

it.each(HTTP_ROUTES)("matches %s", route => {
  const [method, pathname] = route.split(" ") as [string, string];

  expect(httpRouteOf(method, pathname)).toBe(route);
});

it.each([
  ["GET", "/api/nothing"],
  ["GET", "/"],
  ["DELETE", "/api/me"],
  ["POST", "/api/me"],
  ["GET", "/api/account"],
  ["DELETE", "/api/data"],
  ["GET", "/api/rooms"],
  ["GET", "/api/rooms/ABCD2345/socket"],
  ["POST", "/api/rooms/ABCD2345/socket"],
  ["GET", "/api/me/"],
  ["DELETE", "/api/account/"],
  ["get", "/api/me"],
])("matches nothing for %s %s", (method, pathname) => {
  expect(httpRouteOf(method, pathname)).toBeUndefined();
});
