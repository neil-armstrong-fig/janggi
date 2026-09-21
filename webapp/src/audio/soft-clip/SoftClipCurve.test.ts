import {softClipCurve} from "@src/audio/soft-clip/SoftClipCurve";

/** The input each entry of the curve answers, from −1 at the first to +1 at the last. */
function inputAt(curve: Float32Array, index: number): number {
  return -1 + (2 * index) / (curve.length - 1);
}

it("leaves quiet sound exactly as it is", () => {
  const curve = softClipCurve();

  curve.forEach((output, index) => {
    const input = inputAt(curve, index);
    if (Math.abs(input) <= 0.7) expect(output).toBeCloseTo(input, 6);
  });
});

it("treats a push up and a push down alike", () => {
  const curve = softClipCurve();

  curve.forEach((output, index) => {
    expect(output).toBeCloseTo(-(curve[curve.length - 1 - index] ?? NaN), 6);
  });
});

it("never turns a louder input into a quieter output", () => {
  const curve = softClipCurve();

  curve.forEach((output, index) => {
    if (index > 0) expect(output).toBeGreaterThanOrEqual(curve[index - 1] ?? NaN);
  });
});

it("never adds gain, so there is no step where it leaves the straight part", () => {
  const curve = softClipCurve();
  const step = 2 / (curve.length - 1);

  curve.forEach((output, index) => {
    if (index > 0) expect(output - (curve[index - 1] ?? NaN)).toBeLessThanOrEqual(step + 1e-6);
  });
});

it("tops out short of full scale, so the loudest sound is held rather than clipped at the device", () => {
  const curve = softClipCurve();
  const loudest = Math.max(...curve);

  expect(loudest).toBeLessThan(1);
  expect(loudest).toBeGreaterThan(0.8);
});
