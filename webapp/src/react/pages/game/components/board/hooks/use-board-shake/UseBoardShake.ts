import type {RefObject} from "react";
import type {Spring} from "@src/react/pages/game/components/board/hooks/use-board-shake/types/Spring";
import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {springStep} from "@src/react/pages/game/components/board/hooks/use-board-shake/utils/SpringStep";
import {useCallback, useEffect, useRef} from "react";

/** The element to shake, and the shove. */
export interface BoardShake {
  readonly ref: RefObject<HTMLDivElement | null>;
  readonly shake: (impulse: Vector) => void;
}

interface ShakeLoop {
  readonly ref: RefObject<HTMLDivElement | null>;
  readonly springRef: RefObject<Spring>;
  readonly frameRef: RefObject<number | undefined>;
  readonly lastFrameAtRef: RefObject<number>;
}

/**
 * Shakes the board when it is shoved, and lets it spring back.
 *
 * Drives the element directly, a frame at a time, rather than through React state. A shake is sixty
 * frames of a number nobody else reads, and re-rendering ninety cells for each of them would be the
 * one expensive thing on the page. The loop runs only while the board is moving, and stops — clearing
 * what it wrote — the moment it comes to rest.
 *
 * It moves the board with `translate` rather than `transform`, so it leaves alone anything else that
 * might ever be transforming it. Shoves that land while a shake is still going add to it rather than
 * restarting it, as two blows would.
 */
export function useBoardShake(): BoardShake {
  const ref = useRef<HTMLDivElement>(null);
  const springRef = useRef<Spring>(AT_REST);
  const frameRef = useRef<number | undefined>(undefined);
  const lastFrameAtRef = useRef(0);

  useEffect(
    () => () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const shake = useCallback((impulse: Vector): void => {
    const {position, velocity} = springRef.current;
    springRef.current = {position, velocity: {x: velocity.x + impulse.x, y: velocity.y + impulse.y}};

    if (frameRef.current !== undefined) return;

    lastFrameAtRef.current = performance.now();
    const shakeLoop: ShakeLoop = {ref, springRef, frameRef, lastFrameAtRef};
    frameRef.current = requestAnimationFrame(tick.bind(undefined, shakeLoop));
  }, []);

  return {ref, shake};
}

function tick(shakeLoop: ShakeLoop, now: number): void {
  const frames = Math.min(LONGEST_STEP_FRAMES, (now - shakeLoop.lastFrameAtRef.current) / FRAME_MS);
  shakeLoop.lastFrameAtRef.current = now;
  shakeLoop.springRef.current = springStep(shakeLoop.springRef.current, frames);

  const element = shakeLoop.ref.current;

  if (isAtRest(shakeLoop.springRef.current)) {
    shakeLoop.springRef.current = AT_REST;
    shakeLoop.frameRef.current = undefined;
    if (element) element.style.translate = "";

    return;
  }

  const {x, y} = shakeLoop.springRef.current.position;
  if (element) element.style.translate = `${x}px ${y}px`;
  shakeLoop.frameRef.current = requestAnimationFrame(tick.bind(undefined, shakeLoop));
}

/** Close enough to still that the last fraction of a pixel is not worth another frame. */
function isAtRest({position, velocity}: Spring): boolean {
  return Math.hypot(position.x, position.y) < REST_PIXELS && Math.hypot(velocity.x, velocity.y) < REST_PIXELS;
}

const AT_REST: Spring = {position: {x: 0, y: 0}, velocity: {x: 0, y: 0}};

const FRAME_MS = 1000 / 60;

/** A tab left in the background comes back to one long frame, which must not fling the board. */
const LONGEST_STEP_FRAMES = 3;

const REST_PIXELS = 0.05;
