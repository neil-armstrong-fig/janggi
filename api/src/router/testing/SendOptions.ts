export interface SendOptions {
  readonly origin?: string;
  /** Omits the origin which the harness otherwise supplies as the site. */
  readonly withoutOrigin?: boolean;
  readonly cookie?: string;
  readonly body?: unknown;
  /** Text sent exactly as given, for a body that is not JSON. */
  readonly rawBody?: string;
  readonly headers?: Record<string, string>;
}
