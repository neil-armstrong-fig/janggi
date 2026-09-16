/**
 * How one army's plaque reads at a glance.
 *
 * `waiting` is the army that is not on turn; `toMove`, `inCheck` and `layingOut` are the army the
 * board is waiting on, and how urgently; `won`, `lost` and `drawn` are how the game left it.
 */
export type PlaqueState = "waiting" | "toMove" | "inCheck" | "layingOut" | "won" | "lost" | "drawn";
