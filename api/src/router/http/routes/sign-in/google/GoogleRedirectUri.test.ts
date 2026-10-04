import {afterEach, expect, it} from "vitest";
import {googleRedirectUri} from "@src/router/http/routes/sign-in/google/GoogleRedirectUri";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_REDIRECT_URI");
});

it("is this API's own callback, on the host the request came to", () => {
  expect(googleRedirectUri(new Request("https://janggi-api.example/api/auth/google?return=x"))).toBe(
    "https://janggi-api.example/api/auth/google/callback",
  );
});

it("is the override where there is one", () => {
  workerEnvironment.GOOGLE_REDIRECT_URI = "http://localhost:8787/api/auth/google/callback";

  expect(googleRedirectUri(new Request("https://janggi-api.example/api/auth/google"))).toBe(
    "http://localhost:8787/api/auth/google/callback",
  );
});
