import type {PushEventOptions} from "@src/dsl/janggi/components/play-a-friend/playwright/server-push/types/PushEventOptions";

export interface PushWorkerScope {
  readonly dispatchEvent: (event: Event) => boolean;
  readonly PushEvent: new (type: string, pushEventOptions: PushEventOptions) => Event;
}
