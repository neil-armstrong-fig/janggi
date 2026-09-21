/**
 * The promise, or a rejection with `message` if it has not settled within `milliseconds` — whichever comes
 * first. The promise itself is not cancelled, only no longer waited for: whoever asked has been told it is
 * not coming.
 */
export function within<Value>(promise: Promise<Value>, milliseconds: number, message: string): Promise<Value> {
  return new Promise<Value>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(message));
    }, milliseconds);

    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
