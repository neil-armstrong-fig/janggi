/** What the alarm is set to: a time to ring, or no ring at all. */
export type AlarmPlan = {readonly kind: "ring-at"; readonly at: number} | {readonly kind: "never"};
