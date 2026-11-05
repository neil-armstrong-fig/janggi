import type {WirePoint} from "@janggi/shared/janggi/online/messages/action/WirePoint";

/** A move as it crosses the wire: the point it leaves and the point it lands on, as the engine's `Move` says it. */
export interface WireMove {
  readonly from: WirePoint;
  readonly to: WirePoint;
}
