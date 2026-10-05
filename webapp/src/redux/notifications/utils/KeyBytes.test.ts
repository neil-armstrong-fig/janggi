import {keyBytes} from "@src/redux/notifications/utils/KeyBytes";

it("reads unpadded base64url into the bytes it stands for", () => {
  expect([...keyBytes("-__-AQ")]).toEqual([251, 255, 254, 1]);
});

it("reads text that needs no padding", () => {
  expect([...keyBytes("AQID")]).toEqual([1, 2, 3]);
});
