export interface AppearanceOptions {
  readonly state?: AppearanceState;
  readonly timeout?: number;
}

type AppearanceState = "visible" | "attached";
