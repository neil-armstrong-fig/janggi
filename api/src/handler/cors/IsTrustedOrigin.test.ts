import {isTrustedOrigin} from "@src/handler/cors/IsTrustedOrigin";

const ALLOWED = ["https://janggi.neilarmstrong.dev", "http://localhost:3000"];

it("trusts a request from the site", () => {
  expect(isTrustedOrigin("https://janggi.neilarmstrong.dev", ALLOWED)).toBe(true);
});

it("trusts the local dev server when it is listed", () => {
  expect(isTrustedOrigin("http://localhost:3000", ALLOWED)).toBe(true);
});

it("refuses another site", () => {
  expect(isTrustedOrigin("https://evil.example", ALLOWED)).toBe(false);
});

it("refuses a lookalike that only starts with the site's origin", () => {
  expect(isTrustedOrigin("https://janggi.neilarmstrong.dev.evil.example", ALLOWED)).toBe(false);
});

it("refuses a request that names no origin", () => {
  expect(isTrustedOrigin(null, ALLOWED)).toBe(false);
});
