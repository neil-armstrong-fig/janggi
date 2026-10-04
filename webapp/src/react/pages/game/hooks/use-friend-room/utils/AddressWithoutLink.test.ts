import {addressWithoutLink} from "@src/react/pages/game/hooks/use-friend-room/utils/AddressWithoutLink";
import {expect, it} from "vitest";

it("takes the link off, and leaves the rest of the address", () => {
  expect(addressWithoutLink("https://janggi.example/app/?join=ABCD2345&x=1#top")).toBe(
    "https://janggi.example/app/?x=1#top",
  );
});

it("leaves an address with no link as it was", () => {
  expect(addressWithoutLink("https://janggi.example/")).toBe("https://janggi.example/");
});
