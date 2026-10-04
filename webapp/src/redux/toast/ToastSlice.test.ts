import {expect, it} from "vitest";
import {toastDismissed, toastReducer, toastShown} from "@src/redux/toast/ToastSlice";

const initial = toastReducer(undefined, {type: "@@init"});

it("starts with no toast up", () => {
  expect(initial.message).toBeUndefined();
});

it("shows the words it is given, and puts them away again", () => {
  const up = toastReducer(initial, toastShown("Hello"));

  expect(up.message).toBe("Hello");
  expect(toastReducer(up, toastDismissed()).message).toBeUndefined();
});

it("counts the same words shown twice as two toasts, so the second has its own time", () => {
  const first = toastReducer(initial, toastShown("Hello"));
  const second = toastReducer(first, toastShown("Hello"));

  expect(second.id).toBe(first.id + 1);
});
