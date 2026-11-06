import {expect, it} from "vitest";
import {addressWithoutTutorial} from "@src/react/pages/game/hooks/use-tutorial-link/utils/AddressWithoutTutorial";
import {tutorialAddressOf} from "@src/react/pages/tutorial-link/TutorialLink";
import {tutorialAskedFor} from "@src/react/pages/game/hooks/use-tutorial-link/utils/TutorialAskedFor";

it("asks for the tutorial from the address the guide links to", () => {
  const address = new URL(tutorialAddressOf("/ko/"), "https://janggi.example");

  expect(tutorialAskedFor(address.search)).toBe(true);
});

it("asks for nothing from an address without the link", () => {
  expect(tutorialAskedFor("?join=ABCD")).toBe(false);
});

it("takes the link off and leaves the rest of the address", () => {
  expect(addressWithoutTutorial("https://janggi.example/?join=ABCD&tutorial=true#top")).toBe(
    "https://janggi.example/?join=ABCD#top",
  );
});
