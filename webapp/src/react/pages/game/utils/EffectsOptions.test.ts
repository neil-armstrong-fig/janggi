import {EFFECTS} from "@src/react/pages/game/utils/EffectsOptions";
import {expect, it} from "vitest";

it("offers both, so the choice can be changed either way", () => {
  expect(EFFECTS.map(({name}) => name)).toEqual(["Full", "Reduced"]);
});
