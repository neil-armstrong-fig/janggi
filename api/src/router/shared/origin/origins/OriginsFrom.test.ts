import {originsFrom} from "@src/router/shared/origin/origins/OriginsFrom";

it("splits the setting on its commas", () => {
  expect(originsFrom("https://janggi.example,http://localhost:3000")).toEqual([
    "https://janggi.example",
    "http://localhost:3000",
  ]);
});

it("trims what a person typed around a comma, and ignores an empty one, which would otherwise trust the empty origin", () => {
  expect(originsFrom(" https://janggi.example , ,http://localhost:3000, ")).toEqual([
    "https://janggi.example",
    "http://localhost:3000",
  ]);
  expect(originsFrom("")).toEqual([]);
});
