export interface SendOptions {
  readonly origin?: string | null;
  readonly cookie?: string;
  readonly body?: unknown;
  /** Text sent exactly as given, for a body that is not JSON. */
  readonly rawBody?: string;
  readonly headers?: Record<string, string>;
}
