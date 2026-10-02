import {isAbsolute, resolve} from "node:path";
import {apiPath} from "@src/paths/ApiPath";

it("finds the API's migrations, whatever directory the deploy is run from", () => {
  const path = apiPath("migrations");

  expect(isAbsolute(path)).toBe(true);
  expect(path).toBe(resolve(import.meta.dirname, "../../../api/migrations"));
});

it("finds the API Worker's entry file", () => {
  expect(apiPath("src", "ApiWorker.ts")).toMatch(/api\/src\/ApiWorker\.ts$/);
});

it("says which path is missing, and where it looked, rather than leaving a deploy to fail halfway", () => {
  expect(() => apiPath("nothing-here")).toThrow(/API's nothing-here is not at .*api\/nothing-here/);
});
