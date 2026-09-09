/**
 * How loudly a movable piece is marked.
 *
 * Two strengths rather than a boolean because the mark has to give way: while a piece is in hand
 * the alternatives are still worth seeing — that is the whole point of the mark during a check —
 * but they must not compete with the piece being held or the points it may go to.
 */
export type MovableEmphasis = "full" | "faint";
