import {cleanedDisplayName} from "@janggi/shared/janggi/account/CleanedDisplayName";
import {generatedDisplayName} from "@src/router/http/routes/sign-in/finish/generated-display-name/GeneratedDisplayName";

it("names an account for the general the random number picks", () => {
  expect(generatedDisplayName(() => 0)).toBe("Yi Sun-sin");
});

it("can reach the last general in the list, and never runs off its end", () => {
  expect(generatedDisplayName(() => 0.999999)).toBe("Kim Gyeong-seo");
  expect(generatedDisplayName(() => 1)).toBeTruthy();
});

it("only ever makes a name the account would accept from the player, so one can be renamed back to it", () => {
  for (let step = 0; step < 100; step++) {
    const name = generatedDisplayName(() => step / 100);

    expect(cleanedDisplayName(name)).toBe(name);
  }
});

it("uses every general in the list", () => {
  const names = new Set(Array.from({length: 240}, (_, step) => generatedDisplayName(() => step / 240)));

  expect(names.size).toBe(22);
});
