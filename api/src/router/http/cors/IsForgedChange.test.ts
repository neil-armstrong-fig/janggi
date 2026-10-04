import {isForgedChange} from "@src/router/http/cors/IsForgedChange";

const SITE = "https://janggi.example";

it.each(["POST", "PUT", "PATCH", "DELETE"])("refuses a %s from another site, or from none", method => {
  expect(isForgedChange(method, "https://evil.example", [SITE])).toBe(true);
  expect(isForgedChange(method, null, [SITE])).toBe(true);
});

it.each(["POST", "PUT", "PATCH", "DELETE"])("allows a %s from the site", method => {
  expect(isForgedChange(method, SITE, [SITE])).toBe(false);
});

it.each(["GET", "HEAD"])("does not ask where a %s came from, since it changes nothing", method => {
  expect(isForgedChange(method, "https://evil.example", [SITE])).toBe(false);
  expect(isForgedChange(method, null, [SITE])).toBe(false);
});
