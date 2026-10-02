import {requiredEnvironment} from "@src/secrets/required-environment/RequiredEnvironment";

it("gives the value of each variable asked for", () => {
  expect(requiredEnvironment({A: "1", B: "2", C: "3"}, ["A", "C"])).toEqual({A: "1", C: "3"});
});

it("says every variable that is missing at once", () => {
  expect(() => requiredEnvironment({A: "1"}, ["A", "B", "C"])).toThrow("Set B, C in the environment");
});

it("counts a variable that is empty as missing", () => {
  expect(() => requiredEnvironment({A: ""}, ["A"])).toThrow("Set A in the environment");
});
