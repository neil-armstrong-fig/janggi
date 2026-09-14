import {expect, it} from "vitest";
import {channelGainFor} from "@src/audio/utils/ChannelGainFor";

it("is silent with the volume all the way down", () => {
  expect(channelGainFor(0, 0.9)).toBe(0);
});

it("is the channel's full level with the volume all the way up", () => {
  expect(channelGainFor(1, 0.9)).toBe(0.9);
});

it("is a quarter of the full level half-way up, which is heard as about half as loud", () => {
  expect(channelGainFor(0.5, 1)).toBe(0.25);
});

it("gets louder with every step up the slider", () => {
  const gains = Array.from({length: 101}, (_, step) => channelGainFor(step / 100, 1));

  gains.slice(1).forEach((gain, index) => expect(gain).toBeGreaterThan(gains[index] ?? Infinity));
});
