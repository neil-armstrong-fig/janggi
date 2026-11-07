import type {Locator} from "@playwright/test";

export type Bounds = NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>;
