import type {Spring} from "@src/react/pages/game/components/board/hooks/use-board-shake/types/Spring";

/**
 * The board's shake, one step further on: a damped spring pulling it back to where it belongs.
 *
 * The same spring as the shaker in Jonasson and Purho's Juicy Breakout — drag bleeds the speed off,
 * elasticity pulls the offset home — and chosen over random jitter for the reason they chose it. A
 * push has a **direction**, so a capture can shove the board along the line the capturing piece
 * travelled, and a spring carries that through a swing past centre and back rather than scattering it.
 * Random jitter says only that something happened; this says which way it came from.
 *
 * `frames` is time measured in sixtieths of a second, so the shake takes as long on a 120Hz screen as
 * on a 60Hz one.
 */
export function springStep(spring: Spring, frames: number): Spring {
  const velocity = {
    x: spring.velocity.x - spring.velocity.x * DRAG * frames - spring.position.x * ELASTICITY * frames,
    y: spring.velocity.y - spring.velocity.y * DRAG * frames - spring.position.y * ELASTICITY * frames,
  };

  return {
    position: {x: spring.position.x + velocity.x * frames, y: spring.position.y + velocity.y * frames},
    velocity,
  };
}

/** How much of its speed the board loses each frame. */
const DRAG = 0.1;

/** How hard the board is pulled back towards centre each frame, for each pixel it is out. */
const ELASTICITY = 0.1;
