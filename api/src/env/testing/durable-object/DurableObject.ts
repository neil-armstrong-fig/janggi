/** Minimal runtime stand-in for tests that exercise the real Durable Object boundary. */
export class DurableObject {
  protected readonly context: DurableObjectState;

  constructor(context: DurableObjectState, environment: unknown) {
    this.context = context;
    void environment;
  }
}
