import {expect, it} from "vitest";
import {friendArrivalFor} from "@src/react/pages/game/hooks/use-friend-room/utils/FriendArrivalFor";

it("takes a signed-in player to the room a link names", () => {
  expect(friendArrivalFor({status: "signed-in", search: "?join=ABCD2345", keptCode: undefined})).toEqual({
    kind: "link",
    code: "ABCD2345",
  });
});

it("takes a signed-in player back to the room the device kept", () => {
  expect(friendArrivalFor({status: "signed-in", search: "", keptCode: "WXYZ2345"})).toEqual({
    kind: "kept",
    code: "WXYZ2345",
  });
});

it("prefers the link to the kept code", () => {
  expect(friendArrivalFor({status: "signed-in", search: "?join=ABCD2345", keptCode: "WXYZ2345"})).toEqual({
    kind: "link",
    code: "ABCD2345",
  });
});

it("takes a signed-in player nowhere where there is neither", () => {
  expect(friendArrivalFor({status: "signed-in", search: "?other=1", keptCode: undefined})).toBeUndefined();
});

it("does not use a link that is not a code, but still the kept code", () => {
  expect(friendArrivalFor({status: "signed-in", search: "?join=hello", keptCode: "WXYZ2345"})).toEqual({
    kind: "kept",
    code: "WXYZ2345",
  });
});

it.each(["signed-out", "signing-in"] as const)(
  "takes a player who is %s nowhere, whatever the address and the device say",
  status => {
    expect(friendArrivalFor({status, search: "?join=ABCD2345", keptCode: "WXYZ2345"})).toBeUndefined();
  },
);
