import {corsHeadersFor} from "@src/handler/cors/CorsHeadersFor";

const ALLOWED = ["https://janggi.neilarmstrong.dev"];

it("answers the site's own origin with credentials allowed", () => {
  const headers = corsHeadersFor("https://janggi.neilarmstrong.dev", ALLOWED);

  expect(headers.get("Access-Control-Allow-Origin")).toBe("https://janggi.neilarmstrong.dev");
  expect(headers.get("Access-Control-Allow-Credentials")).toBe("true");
});

it("varies on Origin, so a cache never hands one origin's answer to another", () => {
  expect(corsHeadersFor("https://janggi.neilarmstrong.dev", ALLOWED).get("Vary")).toBe("Origin");
});

it("grants nothing to an origin that is not listed", () => {
  const headers = corsHeadersFor("https://evil.example", ALLOWED);

  expect(headers.get("Access-Control-Allow-Origin")).toBeNull();
  expect(headers.get("Access-Control-Allow-Credentials")).toBeNull();
});

it("never answers with a wildcard, which browsers refuse alongside credentials", () => {
  expect(corsHeadersFor("https://evil.example", ALLOWED).get("Access-Control-Allow-Origin")).not.toBe("*");
});
