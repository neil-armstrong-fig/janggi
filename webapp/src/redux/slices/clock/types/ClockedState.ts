import type {RootState} from "@src/redux/Store";

/** The parts of the store that say whether a game has a clock, and which army it is running for. */
export type ClockedState = Pick<RootState, "clock" | "friend" | "game">;
