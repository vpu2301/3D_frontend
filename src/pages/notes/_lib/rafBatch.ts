/**
 * Frame-rate batching for streamed text (FE-5 §2, gate A16).
 *
 * A provider emits tokens far faster than a browser paints. Calling `setState`
 * per chunk on a 2 000-word answer is several thousand renders of a growing
 * transcript, and the visible result is a panel that stutters while it writes —
 * the one moment the product is asking the user to trust it.
 *
 * So chunks accumulate in a plain variable and the newest value is published
 * once per animation frame. The user cannot perceive a difference: the screen
 * only changes 60 times a second either way.
 */

export interface FrameBatcher<T> {
  /** Record the newest value. It reaches `publish` on the next frame. */
  push(value: T): void;
  /** Publish immediately — for stream end, where the last frame must land. */
  flush(): void;
  /** Drop anything pending. For abort, where the partial is handled by hand. */
  cancel(): void;
}

/**
 * `requestAnimationFrame` does not fire in a background tab, which is the
 * correct behaviour for painting and the wrong behaviour for a stream that
 * must still finish. Callers always `flush()` at the end of a stream, so the
 * final state lands whether or not a frame ever came.
 */
export function createFrameBatcher<T>(publish: (value: T) => void): FrameBatcher<T> {
  let pending: { value: T } | null = null;
  let handle: number | null = null;

  const raf =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : // jsdom and any non-DOM consumer: a macrotask is close enough, and it
        // keeps the batching semantics (coalesce, publish later) under test.
        ((callback: FrameRequestCallback) => setTimeout(() => callback(0), 16) as unknown as number);

  const cancelRaf =
    typeof cancelAnimationFrame === 'function'
      ? cancelAnimationFrame
      : ((id: number) => clearTimeout(id as unknown as ReturnType<typeof setTimeout>));

  return {
    push(value) {
      pending = { value };
      // One frame in flight at a time: the whole point is that N chunks between
      // two paints cost one render, not N.
      if (handle === null) {
        handle = raf(() => {
          handle = null;
          const next = pending;
          pending = null;
          if (next) publish(next.value);
        });
      }
    },
    flush() {
      if (handle !== null) {
        cancelRaf(handle);
        handle = null;
      }
      const next = pending;
      pending = null;
      if (next) publish(next.value);
    },
    cancel() {
      if (handle !== null) {
        cancelRaf(handle);
        handle = null;
      }
      pending = null;
    },
  };
}
