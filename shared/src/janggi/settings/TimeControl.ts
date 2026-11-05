/** How much time each army has: free time, and then a number of overtime (초읽기) periods. */
export interface TimeControl {
  readonly minutes: number;
  readonly periodSeconds: number;
  readonly periods: number;
}
