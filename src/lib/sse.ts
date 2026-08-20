/**
 * The app-level `text/event-stream` reader.
 *
 * `EventSource` cannot send an `Authorization` header, so it cannot reach an
 * authenticated Pincer endpoint at all, and it reconnects on its own schedule.
 * `fetch` plus a manual reader gives up nothing and keeps abort honest.
 *
 * The buffer is carried across `read()` calls: a frame ends at a blank line and
 * the network does not align its chunks to that.
 */

export interface SseFrame {
  /** The `event:` field, or `message` when the server omits it (SSE default). */
  event: string;
  /** The `data:` field, with multi-line payloads rejoined on `\n`. */
  data: string;
}

/** Frames are blank-line separated; proxies rewrite line endings, so allow all three. */
function indexOfBoundary(buffer: string): { at: number; length: number } | null {
  let best: { at: number; length: number } | null = null;
  for (const [sep, length] of [
    ['\n\n', 2],
    ['\r\n\r\n', 4],
    ['\r\r', 2],
  ] as const) {
    const at = buffer.indexOf(sep);
    if (at !== -1 && (!best || at < best.at)) best = { at, length };
  }
  return best;
}

function parseFrame(raw: string): SseFrame | null {
  let event = 'message';
  const data: string[] = [];
  for (const line of raw.split(/\r\n|\r|\n/)) {
    // ':' is a comment line; servers use it as a heartbeat.
    if (line.startsWith(':')) continue;
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
  }
  return data.length ? { event, data: data.join('\n') } : null;
}

export async function* sseFrames(body: ReadableStream<Uint8Array>): AsyncIterable<SseFrame> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = indexOfBoundary(buffer);
      while (boundary) {
        const raw = buffer.slice(0, boundary.at);
        buffer = buffer.slice(boundary.at + boundary.length);
        boundary = indexOfBoundary(buffer);
        const frame = parseFrame(raw);
        if (frame) yield frame;
      }
    }
    // Anything still buffered when the body closes is an unterminated frame.
    // Acting on half a payload is worse than dropping it.
  } finally {
    await reader.cancel().catch(() => {});
  }
}
