/** How a push to one device went: taken by the push service, the device gone for good, or a failure that may pass. */
export type PushOutcome = "sent" | "gone" | "failed";
