import {errorNameOf} from "@src/observability/ErrorNameOf";

it("keeps an Error's class name without its message", () => {
  expect(errorNameOf(new TypeError("token secret-token was refused"))).toBe("TypeError");
});

it("ignores arbitrary text assigned to an Error's name", () => {
  const error = new TypeError("request failed");
  error.name = "secret-token";

  expect(errorNameOf(error)).toBe("TypeError");
});

it("uses a fixed name for a thrown value that is not an Error", () => {
  expect(errorNameOf("secret-token")).toBe("UnknownError");
});
