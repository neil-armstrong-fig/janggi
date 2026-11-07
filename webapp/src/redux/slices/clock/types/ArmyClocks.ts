import type {ArmyClock} from "@src/redux/slices/clock/types/ArmyClock";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** Both armies' banked time. */
export type ArmyClocks = Readonly<Record<Side, ArmyClock>>;
