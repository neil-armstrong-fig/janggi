/** The time one army has banked between its turns. With no free time (자유시간) left, it is in overtime (초읽기). */
export interface ArmyClock {
  readonly freeMs: number;
  /** The periods left, counting the one being spent. */
  readonly periods: number;
}
