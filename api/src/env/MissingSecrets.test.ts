import {missingSecrets} from "@src/env/MissingSecrets";

it("finds nothing missing where both secrets are set", () => {
  expect(missingSecrets({GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "secret"})).toEqual([]);
});

it("names each secret that is not set", () => {
  expect(missingSecrets({GOOGLE_CLIENT_ID: "id"})).toEqual(["GOOGLE_CLIENT_SECRET"]);
  expect(missingSecrets({})).toEqual(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]);
});

it("counts a secret that is empty as missing", () => {
  expect(missingSecrets({GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "secret"})).toEqual(["GOOGLE_CLIENT_ID"]);
});
