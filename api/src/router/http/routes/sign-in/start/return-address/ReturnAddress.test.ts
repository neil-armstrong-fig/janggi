import {returnAddress} from "@src/router/http/routes/sign-in/start/return-address/ReturnAddress";

const ALLOWED = ["https://janggi.neilarmstrong.dev", "http://localhost:3000"];

it("returns to the page the app asked to be brought back to, on an allowed site", () => {
  expect(returnAddress("https://janggi.neilarmstrong.dev/play?x=1", ALLOWED)).toBe(
    "https://janggi.neilarmstrong.dev/play?x=1",
  );
  expect(returnAddress("http://localhost:3000/", ALLOWED)).toBe("http://localhost:3000/");
});

it("returns to the first allowed site where the app asked for nothing", () => {
  expect(returnAddress(null, ALLOWED)).toBe("https://janggi.neilarmstrong.dev/");
});

it("will not send the player to a site that is not allowed", () => {
  expect(returnAddress("https://evil.example/", ALLOWED)).toBe("https://janggi.neilarmstrong.dev/");
});

it("will not be fooled by an address that merely starts with, or contains, an allowed site", () => {
  expect(returnAddress("https://janggi.neilarmstrong.dev.evil.example/", ALLOWED)).toBe(
    "https://janggi.neilarmstrong.dev/",
  );
  expect(returnAddress("https://evil.example/?https://janggi.neilarmstrong.dev", ALLOWED)).toBe(
    "https://janggi.neilarmstrong.dev/",
  );
  expect(returnAddress("https://janggi.neilarmstrong.dev@evil.example/", ALLOWED)).toBe(
    "https://janggi.neilarmstrong.dev/",
  );
});

it("will not send the player anywhere that is not a web page of an allowed site", () => {
  expect(returnAddress("javascript:alert(1)", ALLOWED)).toBe("https://janggi.neilarmstrong.dev/");
  expect(returnAddress("not a url", ALLOWED)).toBe("https://janggi.neilarmstrong.dev/");
});
