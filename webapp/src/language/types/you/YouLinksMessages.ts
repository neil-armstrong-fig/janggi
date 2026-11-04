import type {YouLinkMessages} from "@src/language/types/you/YouLinkMessages";

/** The app and help links in the You tab. The developer's website needs no note: its address is its note. */
export interface YouLinksMessages {
  readonly heading: string;
  readonly install: string;
  readonly guide: YouLinkMessages;
  readonly replayTour: YouLinkMessages;
  readonly references: YouLinkMessages;
  readonly developerWebsite: string;
  readonly repository: YouLinkMessages;
}
