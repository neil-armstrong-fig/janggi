/**
 * What `cloudflare:workers` is under node: a module that only the Workers runtime has (`vitest.config.ts` points the import
 * here). `env` is an empty object, and a test that touches a binding sets it on `workerEnvironment` itself and puts it back —
 * so the code under test reads its bindings the way it does in the Worker, and the test does the stubbing.
 */
export {DurableObject} from "@src/env/testing/durable-object/DurableObject";

export const env: Record<string, unknown> = {};
