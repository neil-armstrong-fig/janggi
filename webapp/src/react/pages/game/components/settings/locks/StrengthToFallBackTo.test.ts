import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {strengthToFallBackTo} from "@src/react/pages/game/components/settings/locks/StrengthToFallBackTo";

const CHO_HAS_CLIMBED_IN_CASUAL = {...freshProgress().beaten, Casual: {cho: [800 as const, 1000 as const], han: []}};

it("changes nothing where the strength is open on the ladder chosen", () => {
  expect(
    strengthToFallBackTo({beaten: CHO_HAS_CLIMBED_IN_CASUAL, format: "Casual", choice: "Cho", botElo: 1200}),
  ).toBeUndefined();
});

it("drops to the strongest bot open where the army chosen has not climbed as far", () => {
  expect(strengthToFallBackTo({beaten: CHO_HAS_CLIMBED_IN_CASUAL, format: "Casual", choice: "Han", botElo: 1200})).toBe(
    800,
  );
});

it("drops to the strongest bot open where the format chosen has not been climbed", () => {
  expect(strengthToFallBackTo({beaten: CHO_HAS_CLIMBED_IN_CASUAL, format: "Scored", choice: "Cho", botElo: 1000})).toBe(
    800,
  );
});

it("drops to what both armies have reached where the side is Random", () => {
  const bothClimbed = {...freshProgress().beaten, Casual: {cho: [800 as const, 1000 as const], han: [800 as const]}};

  expect(strengthToFallBackTo({beaten: bothClimbed, format: "Casual", choice: "Random", botElo: 1200})).toBe(1000);
});
