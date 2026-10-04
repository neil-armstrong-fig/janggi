// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {chooseGame} from "@src/redux/online/actions/ChooseGame";
import {createStore} from "@src/redux/Store";
import {signedIn} from "@src/redux/account/AccountSlice";

it("sends someone signed out to the account card when they choose Online", () => {
  const store = createStore(undefined);

  store.dispatch(chooseGame("friend"));

  expect(store.getState().settings).toMatchObject({openSheet: "settings", tab: "You", accountHighlighted: true});
  expect(store.getState().toast.message).toBe("Sign in to play a friend online.");
});

it("offers someone signed in, and in no room, the sheet to make or take a code when they choose Online", () => {
  const store = createStore(undefined);
  store.dispatch(signedIn("Kim"));

  store.dispatch(chooseGame("friend"));

  expect(store.getState().settings.openSheet).toBe("friend");
});

it("leaves the sheets alone when they choose Local", () => {
  const store = createStore(undefined);

  store.dispatch(chooseGame("local"));

  expect(store.getState().settings.openSheet).toBeUndefined();
});
