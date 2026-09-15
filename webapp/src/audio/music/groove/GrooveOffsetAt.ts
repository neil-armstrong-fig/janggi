/**
 * How late the music plays a step, as a share of the step's own length.
 *
 * Music played dead on the grid sounds stale however good its notes, because no player does that.
 * **Where the rhythm swings, its off-steps are swung** — every second step lands a little late, so each
 * pair of steps leans long–short and the line walks rather than ticks. A 장단 counted in threes already
 * lilts, and is played straight. **Every step is loosened** by a hair more, the way a room of players
 * never strikes quite together. The whole ensemble is handed the one offset for a step, so it grooves
 * together rather than drifting apart.
 *
 * A step is only ever played late, never early — a note booked before its step could fall before the
 * audio clock has reached it — and never so late that it runs into the next step. `looseness` is how far
 * into the loosening this step falls, between nought and one, handed in for the reason the patterns'
 * rolls are.
 */
export function grooveOffsetAt(step: number, looseness: number, swings: boolean): number {
  const swing = swings && Math.abs(step) % 2 === 1 ? SWING : 0;

  return swing + Math.min(1, Math.max(0, looseness)) * LOOSENESS;
}

/**
 * How late an off-step lands: far enough to lean, not so far that it limps. More than this was heard
 * as stumbling rather than swing.
 */
const SWING = 0.08;

/**
 * The most a step is loosened by: a few milliseconds, felt rather than heard. Timing that wandered
 * further than this sounded like players who could not keep time, not like players at ease.
 */
const LOOSENESS = 0.01;
