import {expect, it} from "vitest";
import {isAccountOffered} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/account/utils/IsAccountOffered";

it("offers nothing to somebody who has not asked and has no account", () => {
  expect(isAccountOffered("", "signed-out")).toBe(false);
  expect(isAccountOffered("?other=1", "signed-out")).toBe(false);
});

it("offers the account to somebody who adds ?account to the address", () => {
  expect(isAccountOffered("?account", "signed-out")).toBe(true);
  expect(isAccountOffered("?account=1", "signed-out")).toBe(true);
  expect(isAccountOffered("?x=1&account", "signed-out")).toBe(true);
});

it("does not take a longer name for the flag", () => {
  expect(isAccountOffered("?accounts", "signed-out")).toBe(false);
});

it("keeps offering it to a device that has signed in, whatever the address says", () => {
  expect(isAccountOffered("", "signed-in")).toBe(true);
});

it("offers it to a device part-way through signing in, so the page Google returns to still shows it", () => {
  expect(isAccountOffered("", "signing-in")).toBe(true);
});
