import {preflightHeaders} from "@src/router/http/cors/PreflightHeaders";

it("allows what the app sends, and lets the browser remember it for two hours", () => {
  const headers = preflightHeaders(new Headers());

  expect(headers.get("Access-Control-Allow-Methods")).toBe("GET, PUT, POST, PATCH, DELETE");
  expect(headers.get("Access-Control-Allow-Headers")).toBe("Content-Type, If-Match");
  expect(headers.get("Access-Control-Max-Age")).toBe("7200");
});

it("keeps the headers it was given, and does not change them", () => {
  const given = new Headers({"Access-Control-Allow-Origin": "https://janggi.example"});

  expect(preflightHeaders(given).get("Access-Control-Allow-Origin")).toBe("https://janggi.example");
  expect(given.get("Access-Control-Max-Age")).toBeNull();
});
